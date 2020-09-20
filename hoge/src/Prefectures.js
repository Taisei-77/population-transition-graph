import React, { useEffect, useState } from "react";
import axios from "axios";

//RESASのAPIkey
const apiKey = "0NEv0Ri2nZMNnApZ3qrtkDf0jCKuolBfrrIwx8d8";

//RESASの都道府県一覧を取得するためのAPI
const PrefecturesApi = "https://opendata.resas-portal.go.jp/api/v1/prefectures";

//RESASの人口構成データを取得するためのAPI
const populationAPI =
  "https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear";
// APIの最後に ?prefCode=〇〇　とつけると、その都道府県の人口構成を取得することができる。

const Prefectures = () => {
  const [selected, setSelected] = useState(Array(47).fill(false));
  const [prefectures, setPrefectures] = useState([]);

  useEffect(() => {
    //RESASのAPIにアクセスするためのリクエストヘッダー
    const headers = {
      "X-API-KEY": apiKey,
    };
    //RESASから47都道府県データを取得
    const getPrefecturesData = async () => {
      await axios
        .get(PrefecturesApi, { headers: headers })
        .then((res) => {
          console.log(res.data.result);
          //レスポンスから都道府県コードと都道府県名を取り出して、state : prefecturesに格納。
          setPrefectures(res.data.result);
        })
        .catch((error) => {
          alert(error);
        });
    };
    getPrefecturesData();
  }, []);

  //都道府県チェックボックスの値が変わった際に実行される関数
  const changeSelected = (indexNumber) => {
    const selectedCopy = selected.slice();
    //変更があった都道府県チェックボックスに対応している、select配列の値を反転させる。
    selectedCopy[indexNumber] = !selectedCopy[indexNumber];
    console.log(selectedCopy);

    if (selectedCopy[indexNumber]) {
      //RESASのAPIにアクセスするためのリクエストヘッダー
      const headers = {
        "X-API-KEY": apiKey,
      };
      //人口構成を取得
      const getPopulation = async () => {
        await axios
          .get(
            `https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?cityCode=-&prefCode=${
              indexNumber + 1
            }`,
            { headers: headers }
          )
          .then((res) => {
            console.log(res.data.result.data[0]); //対象都道府県の総人口データ。
          })
          .catch((error) => {
            alert(error);
          });
      };
      getPopulation();
    }
    setSelected(selectedCopy);
  };

  //map()で各都道府県のデータを引数dataに渡して、要素を生成するための変数定義。
  const checkboxItem = (data) => {
    return (
      <div key={data.prefCode}>
        <input
          type="checkbox"
          checked={selected[data.prefCode - 1]}
          onChange={() => {
            changeSelected(data.prefCode - 1);
          }}
        ></input>
        {data.prefName}
      </div>
    );
  };

  return (
    <div>
      <div>{prefectures.map((data) => checkboxItem(data))}</div>
    </div>
  );
};

export default Prefectures;
