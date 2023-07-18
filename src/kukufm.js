import response from "./data.json";
import _ from "lodash";
import axios from "axios";
import fileDownload from "js-file-download";
import ReactAudioPlayer from "react-audio-player";
import saregamaCarvaan from "./saregamaCarvaan-marathi.json";
import saregamaCarvaanSongs from "./saregama-carvaan-marathi-songs.json";

import { useEffect, useState } from "react";
let listData = [];

export function Kukufm() {
  const [state, setState] = useState([]);
  const [playURL, setPlayURL] = useState(null);
  const [progress, setDownloadProgress] = useState({});
  const [episode, setEpisode] = useState({});
  const [search, setSearch] = useState("");

  useEffect(() => {
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });
    // Get the value of "some_key" in eg "https://example.com/?some_key=some_value"
    let show_id = params.show_id; // "some_value"
    let page = params?.page || 1;

    axios
      .get(`https://kukufm.com/api/v2.1/channels/${show_id}/episodes/?lang=english&page=${page}`)
      .then((res) => {
        let data = res.data.episodes;

        setState(data);
      });
  }, []);

  const handleDownload = async (url, filename, key) => {
    await axios({
      // url: url.replace("http://d3d7iaj1xyzes9.cloudfront.net/", ""),
      url: 'https://kukufm.com'+url,
      method: "GET",
      responseType: "text", // important
      onDownloadProgress: (progressEvent) => {
        let percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        ); // you can use this to show user percentage of file

        let obj = {
          ...progress,
          [key]: percentCompleted,
        };
        setDownloadProgress(obj);
      },
    }).then((res) => {
      var parser = new DOMParser();
      var doc = parser.parseFromString(res.data, "text/html");
      let url = JSON.parse(doc.scripts[0].text).audio[0].contentUrl;
        window.open(url);

    //   handleDownload2(url, filename, key);
    //   fileDownload(url, filename);
      let obj = {
        ...progress,
        [key]: 0,
      };
      setDownloadProgress(obj);
    });
  };

  const handleDownload2 = async (url, filename, key) => {
    await axios({
      // url: url.replace("http://d3d7iaj1xyzes9.cloudfront.net/", ""),
      url: url,
      method: "GET",
      headers: {
        'Content-Type': 'application/mp4',
      },
      responseType: "blob", // important
      onDownloadProgress: (progressEvent) => {
        let percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        ); // you can use this to show user percentage of file

        let obj = {
          ...progress,
          [key]: percentCompleted,
        };
        setDownloadProgress(obj);
      },
      
    })
    .then((blob) => {
        const url = window.URL.createObjectURL(
            new Blob([blob]),
          );
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute(
            'download',
            filename,
          );
          document.body.appendChild(link);
          link.click();
          link.parentNode.removeChild(link);
    //   fileDownload(res, filename,'application/mp4');
      let obj = {
        ...progress,
        [key]: 0,
      };
      setDownloadProgress(obj);
    });
  };

  const apiDataFetch = async (index, data) => {
    await axios({
      url: `ajax?action=view&type=playsong&id=${data[index]}&cType=1`,
      method: "GET",
      timeout: 1000 * 20,
      responseType: "json", // important
      onDownloadProgress: (progressEvent) => {
        let percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        ); // you can use this to show user percentage of file
      },
    })
      .then((res) => {
        // listData.push(res.data[0]);
        let song = res.data[0];
        axios({
          url: song?.playurl.replace("http://", "https://"),
          method: "GET",
          responseType: "blob", // important
          onDownloadProgress: (progressEvent) => {
            let percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            ); // you can use this to show user percentage of file

            console.log(percentCompleted);
          },
        }).then((res) => {
          fileDownload(
            res.data,
            `${song?.album_id}_${song?.album_name}_${song?.song_name}.mp3`
          );
        });
      })
      .catch((error) => {
        console.error(index, data.length, data[index], error);
      })
      .finally(() => {
        console.log(index, data.length, data[index]);

        if (index > data.length - 2) {
          downloadObjectAsJson(listData, "saregama-carvaan-marathi-songs");
          console.warn("completed");
        } else {
          setTimeout(() => {
            apiDataFetch(++index, data);
          }, 1);
        }
      });
  };
  const apiDataDownload = async (index, data) => {
    let song = data[index];
    axios({
      url: song?.playurl.replace("http://", "https://"),
      method: "GET",
      responseType: "blob", // important
      onDownloadProgress: (progressEvent) => {
        let percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        ); // you can use this to show user percentage of file

        console.log(percentCompleted);
      },
    })
      .then((res) => {
        fileDownload(
          res.data,
          `${song?.album_id}_${song?.album_name}_${song?.song_name}.mp3`
        );
      })
      .catch((error) => {
        console.error(index, data.length, data[index], error);
      })
      .finally(() => {
        console.log(index, data.length, data[index]);

        if (index > data.length - 2) {
          // downloadObjectAsJson(listData, "saregama-carvaan-marathi-songs");
          console.warn("completed");
        } else {
          setTimeout(() => {
            apiDataDownload(++index, data);
          }, 1);
        }
      });
  };

  const handleSCDownload = async () => {
    // let list = _.orderBy(saregamaCarvaan);
    // apiDataFetch(0, [ 1505, 1515, 13652, 20290, 20294, 20295, 20315, 20370, 20375, 36403,
    //   36643, 37580, 37692, 66574, 66629, 66630, 66631, 66707, 67425, 92603,
    //   92604, 100053, 121408, 130073, 130963, 131112, 131113, 131132]);
    console.log(
      saregamaCarvaanSongs
        .filter((obj) =>
          [
            1505, 1515, 13652, 20290, 20294, 20295, 20315, 20370, 20375, 36403,
            36643, 37580, 37692, 66574, 66629, 66630, 66631, 66707, 67425,
            92603, 92604, 100053, 121408, 130073, 130963, 131112, 131113,
            131132,
          ].includes(Number(obj.song_id))
        )
        .map((obj) => obj.song_url)
    );
    // apiDataDownload(
    //   0,
    //   saregamaCarvaanSongs.filter((obj) =>
    //     [
    //       1505, 1515, 13652, 20290, 20294, 20295, 20315, 20370, 20375, 36403,
    //       36643, 37580, 37692, 66574, 66629, 66630, 66631, 66707, 67425, 92603,
    //       92604, 100053, 121408, 130073, 130963, 131112, 131113, 131132,
    //     ].includes(Number(obj.song_id))
    //   )
    // );

    // console.log(_.groupBy(saregamaCarvaanSongs,(obj)=>obj.album_id))
  };

  function downloadObjectAsJson(exportObj, exportName) {
    var dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }
  const onClick = (episodeObj) => {
    setEpisode(episodeObj);
  };
  const setObject = (obj) => {
    setEpisode(state.find((data) => data.seq_number === obj.seq_number));
  };

  const listRender = (data, search) => {
    return data
      .filter((obj) =>
        search
          ? obj.title.toLocaleLowerCase().match(search.toLocaleLowerCase())
            ? true
            : false
          : true
      )

      .map((obj) => {
        return (
          <div key={obj.web_uri} className="card" onClick={() => onClick(obj)}>
            <h1> {obj.title} </h1>

            <br />
          </div>
        );
      });
  };
  const playAudio = (url, filename) => {
    setPlayURL(url);
  };
  return episode?.web_uri ? (
    <>
      <div key={episode.web_uri} className="card">
        <h1> {episode.title} </h1>

        <br />

        <a
          className="ml-1"
          href="#"
          onClick={() =>
            handleDownload(episode.web_uri, `${episode.title}.mp4`)
          }
        >
          Download{" "}
          {progress[episode.title] ? ` ( ${progress[episode.title]} )` : null}
        </a>

        <a
          className="ml-1"
          href="#"
          onClick={() => playAudio(episode.web_uri, `${episode.title}.mp3`)}
        >
          Play
        </a>
        <a className="ml-1" href="#" onClick={() => playAudio(null)}>
          Stop
        </a>
        <a className="ml-1" href="#" onClick={() => setEpisode({})}>
          Back
        </a>

        {episode.web_uri === playURL ? (
          <div className="player">
            <ReactAudioPlayer src={episode.web_uri} autoPlay={true} controls />
          </div>
        ) : null}
      </div>
    </>
  ) : (
    <>
      <input type="text" onChange={(e) => setSearch(e.target.value)}></input>
      <br />
      {listRender(state, search)}
    </>
  );
}
