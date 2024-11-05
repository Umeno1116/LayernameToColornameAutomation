// CSVファイルのパスを指定
var csvFilePath = "C:\\Users\\xiuxi\\OneDrive\\autoPsmotion\\colorMapping.csv"; // 適切なパスに変更してください

// CSVファイルを読み込む関数
function loadColorMapping(filePath) {
    var file = new File(filePath);
    var colorMapping = {};

    try {
        file.open("r");
        //alert("CSVファイルを開きました: " + filePath); // ファイルを開いたことを通知
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

// 選択したレイヤーを取得
var selectedLayer = app.activeDocument.activeLayer;
var colorMapping = loadColorMapping(csvFilePath); // CSVファイルを読み込む

// 選択したレイヤー名がマッピングに存在するかチェック
if (colorMapping[selectedLayer.name]) {
    // 新しいテキストを取得
    var newText = colorMapping[selectedLayer.name];

    // テキストレイヤーの名前を "カラー名" に設定
    var textLayerName = "カラー名";

    // 指定した名前のテキストレイヤーを取得
    try {
        var textLayer = app.activeDocument.artLayers.getByName(textLayerName);

        // テキストレイヤーが存在し、かつテキストレイヤーであるか確認
        if (textLayer && textLayer.kind == LayerKind.TEXT) {
            // テキストレイヤーの内容を変更
            textLayer.textItem.contents = newText;
            alert("テキストを '" + newText + "' に変更しました。");
        } else {
            alert("指定したテキストレイヤー '" + textLayerName + "' が見つかりません、またはテキストレイヤーではありません。");
        }
    } catch (e) {
        alert("エラー: " + e.message);
    }
} else {
    alert("選択したレイヤーの名前 '" + selectedLayer.name + "' に対応するテキストが見つかりません。");
}
