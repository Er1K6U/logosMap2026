<?php
// tools/extract_deptos.php

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
        throw new Exception("No existe el archivo SVG en: $svgPath");
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
                'svg_name' => $name,
                'norm_name' => normalize_depto($name),
            ];
        }
    }

    return $out;
}

// ✅ CAMBIA ESTA RUTA a donde tengas tu colombia.svg
$svgPath = __DIR__ . '/../public/assets/colombia.svg';

try {
    $depts = extract_departamentos_from_svg($svgPath);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($depts, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
    http_response_code(500);
    echo "Error: " . $e->getMessage();
}
