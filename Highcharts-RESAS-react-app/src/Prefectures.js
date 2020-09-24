import React, { useEffect, useState } from "react";
import axios from "axios";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "./Prefectures.modules.css";

//RESASのAPIkey
const apiKey = "0NEv0Ri2nZMNnApZ3qrtkDf0jCKuolBfrrIwx8d8";

//RESASの都道府県一覧を取得するためのAPI
const PrefecturesApi = "https://opendata.resas-portal.go.jp/api/v1/prefectures";

//RESASの人口構成データを取得するためのAPI
//   "https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear"
// APIの最後に ?prefCode=〇〇　とつけると、その都道府県の人口構成を取得することができる。

const Prefectures = () => {
  const [selected, setSelected] = useState(Array(47).fill(false)); //チェックボックスにチェックが入っているかをtrueとfalseで判定する。
  const [prefectures, setPrefectures] = useState([]); //都道府県データを格納する。
  const [series, setSeries] = useState([]); //動的に取得した都道府県別の人口データを格納する。
  const [chartOptions, setChartOptions] = useState({
    title: {
      text: "都道府県別の総人口推移",
    },

    subtitle: {
      text: "（2015年以降は推計値）",
    },

    yAxis: {
      title: {
        text: "総人口数",
      },
    },

    xAxis: {
      title: {
        text: "年度",
      },
    },

    plotOptions: {
      label: {
        connectorAllowed: false,
      },

      series: {
        pointStart: 1960,
        pointInterval: 5,
      },
    },

    series: series,
  });

  //HighChartの設定

  //初回レンダリング時に実行される。
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
    selectedCopy[indexNumber] = !selectedCopy[indexNumber];
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
            const populationData = []; //人口データを配列で保存するための変数
            //対象都道府県の総人口データ => res.data.result.data[0].data
            //レスポンスから人口データのみを抜き出して、populationDataに格納していく。
            res.data.result.data[0].data.forEach((element) => {
              populationData.push(element.value);
            });
            //seriesに追加するためのデータを作る。
            const seriesData = {
              data: populationData,
              name: prefectures[indexNumber].prefName,
            };
            setChartOptions({
              ...chartOptions,
              series: series.concat(seriesData),
            });
            setSeries(series.concat(seriesData));
            setSelected(selectedCopy);
          })
          .catch((error) => {
            alert(error);
          });
      };
      getPopulation();
    } else {
      //チェックが外れた時
      const seriesCopy = series;
      for (let i = 0; i < seriesCopy.length; i++) {
        if (seriesCopy[i].name === prefectures[indexNumber].prefName) {
          seriesCopy.splice(i, 1);
        }
      }
      setChartOptions({
        ...chartOptions,
        series: seriesCopy,
      });
      setSeries(seriesCopy);
      setSelected(selectedCopy);
    }
  };

  //map()で各都道府県のデータを引数dataに渡して、要素を生成するための変数定義。
  const checkboxItem = (data) => {
    return (
      <div key={data.prefCode} className="prefecturesElement">
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
      <div className="title">都道府県別の総人口推移グラフ</div>
      <div className="prefecturesContainer">
        {prefectures.map((data) => checkboxItem(data))}
      </div>
      <HighchartsReact
        highcharts={Highcharts}
        immutable={true}
        options={chartOptions}
      />
    </div>
  );
};

export default Prefectures;
