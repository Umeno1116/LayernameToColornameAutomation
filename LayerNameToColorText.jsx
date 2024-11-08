// CSVファイルのパスを指定
var csvFilePath = "C:\\Users\\xiuxi\\OneDrive\\autoPsmotion\\colorMapping.csv"; // 適切なパスに変更してください

// CSVファイルを読み込む関数
function loadColorMapping(filePath) {
    var file = new File(filePath);
    var colorMapping = {};

    try {
        file.open("r");
        var lines = file.read().split('\n'); // 行ごとに分割
        file.close();

        for (var i = 1; i < lines.length; i++) { // 1行目はヘッダーなのでスキップ
            var line = lines[i].replace(/^\s+|\s+$/g, ''); // 行の前後の空白を削除
            if (line) { // 空行をスキップ
                var parts = line.split(','); // カンマで分割
                if (parts.length === 2) { // 2つの要素があることを確認
                    var key = parts[0].replace(/^\s+|\s+$/g, ''); // レイヤー名
                    var value = parts[1].replace(/^\s+|\s+$/g, ''); // カラー名
                    colorMapping[key] = value; // マッピングに追加
                }
            }
        }
        return colorMapping;
    } catch (e) {
        alert("エラー: " + e.message);
        return {};
    }
}

// グループ内で指定した名前のレイヤーを探す関数
function findLayerByNameInGroup(group, name) {
    for (var i = 0; i < group.artLayers.length; i++) {
        var layer = group.artLayers[i];
        if (layer.name === name && layer.kind === LayerKind.TEXT) {
            return layer;
        }
    }
    return null; // 見つからない場合
}

// 選択したレイヤーのチェック
var selectedLayer = app.activeDocument.activeLayer;
var colorMapping = loadColorMapping(csvFilePath); // CSVファイルを読み込む

// カラー名レイヤーとそれ以外のレイヤーを特定する
var mainLayer = null;
var colorNameLayer = null;

if (selectedLayer.parent) {
    var layers = selectedLayer.parent.artLayers;

    for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];
        if (layer.name === "カラー名") {
            colorNameLayer = layer;
        } else if (layer.name !== selectedLayer.name) {
            mainLayer = layer;
        }
    }

    if (mainLayer && colorMapping[mainLayer.name]) {
        var newText = colorMapping[mainLayer.name]; // 新しいテキストを取得

        if (colorNameLayer) {
            // テキストレイヤーの内容を変更
            colorNameLayer.textItem.contents = newText;
            alert("テキストを '" + newText + "' に変更しました。");
        } else {
            alert("同じグループ内に指定したテキストレイヤー 'カラー名' が見つかりません。");
        }
    } else {
        alert("選択したレイヤーの名前 '" + mainLayer.name + "' に対応するテキストが見つかりません。");
    }
} else {
    alert("選択したレイヤーはグループに属していません。");
}
