<?php
/**
 * Seed de departamentos desde colombia.svg -> tabla departamentos
 * Uso: php scripts/seed_departamentos.php
 */

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

function normalize_depto(string $s): string
{
    $s = trim($s);
    $s = mb_strtolower($s, 'UTF-8');
    $s = str_replace(['á', 'é', 'í', 'ó', 'ú', 'ü', 'ñ'], ['a', 'e', 'i', 'o', 'u', 'u', 'n'], $s);
    $s = preg_replace('/[^a-z0-9 ]+/', ' ', $s);
    $s = preg_replace('/\s+/', ' ', $s);
    return strtoupper(trim($s));
}

function extract_departamentos_from_svg(string $svgPath): array
{
    if (!file_exists($svgPath)) {
        throw new RuntimeException("No existe el SVG en: $svgPath");
    }

    $doc = new DOMDocument();
    $doc->load($svgPath);

    $paths = $doc->getElementsByTagName('path');
    $out = [];

    foreach ($paths as $p) {
        $id = trim($p->getAttribute('id'));
        $name = trim($p->getAttribute('name'));

        // Solo los que realmente representan deptos
        if ($id !== '' && $name !== '') {
            $out[] = [
                'svg_id' => $id,
                'nombre' => $name,
                'nombre_norm' => normalize_depto($name),
            ];
        }
    }

    return $out;
}

// ========= CONFIG =========
// Ajusta esto a tu realidad:
$svgPath = __DIR__ . '/../public/assets/colombia.svg';  // <-- cambia la ruta si tu svg está en otro lado

$dbHost = '127.0.0.1';
$dbUser = 'root';
$dbPass = '';                 // en Laragon suele ser vacío
$dbName = 'mapa_colombia';
// ==========================

$items = extract_departamentos_from_svg($svgPath);

$mysqli = new mysqli($dbHost, $dbUser, $dbPass, $dbName);
$mysqli->set_charset('utf8mb4');

$mysqli->begin_transaction();

try {
    // Inserta o actualiza si ya existe (por svg_id)
    $sql = "INSERT INTO departamentos (svg_id, nombre, nombre_norm, activo, created_at, updated_at)
            VALUES (?, ?, ?, 1, NOW(), NOW())
            ON DUPLICATE KEY UPDATE
              nombre=VALUES(nombre),
              nombre_norm=VALUES(nombre_norm),
              activo=1,
              updated_at=NOW()";

    $stmt = $mysqli->prepare($sql);

    $count = 0;
    foreach ($items as $it) {
        $stmt->bind_param('sss', $it['svg_id'], $it['nombre'], $it['nombre_norm']);
        $stmt->execute();
        $count++;
    }

    $mysqli->commit();

    echo "OK ✅ Departamentos procesados: {$count}\n";
    echo "Tip: revisa en BD: SELECT * FROM departamentos ORDER BY nombre;\n";
} catch (Throwable $e) {
    $mysqli->rollback();
    echo "ERROR ❌ " . $e->getMessage() . "\n";
    exit(1);
}
