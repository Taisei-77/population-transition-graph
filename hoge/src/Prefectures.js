import React, { useEffect, useState } from "react";
import axios from "axios";

//RESASのAPIkey
const apiKey = "0NEv0Ri2nZMNnApZ3qrtkDf0jCKuolBfrrIwx8d8";
//RESASの都道府県一覧を取得するためのAPI
const PrefecturesApi = "https://opendata.resas-portal.go.jp/api/v1/prefectures";

const Prefectures = () => {
  const [prefectures, setPrefectures] = useState([]);

  //RESASのAPIにアクセスするためのリクエストヘッダー
  const headers = {
    "X-API-KEY": apiKey,
  };

  useEffect(() => {
    const get_prefectures_data = async () => {
      await axios
        .get(PrefecturesApi, { headers: headers })
        .then((res) => {
          console.log(res.data.result);
          setPrefectures(res.data.result);
        })
        .catch((error) => {
          alert(error);
        });
    };
    get_prefectures_data();
  }, []);

  return (
    <div>
      <div></div>
    </div>
  );
};

export default Prefectures;
