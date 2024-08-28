import React, { useEffect, useState } from "react";
import "./Homepage.css";
import Weather from "../Weather/Weather";
import customeDate from "../../Hooks/Date";
import { Link } from "react-router-dom";
import BASE_URL from '../../baseUrl';
import axios from "axios";
import CommonCate from "../CommonCategory/CommonCate";

function Homepage() {
  const [newsData, setNewsData] = useState([]);
  const [firstData, setFirstData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const url = `${BASE_URL}news/all`;
        const res = await axios.get(url);
        setNewsData(res.data.articles);
        setFirstData(res.data.articles[0]);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Error fetching news data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="cont">
      {/* DATE AND WEATHER */}
      <div className="dateAndWeather flex align-items-center ">
        <div className="date">{customeDate()}</div>
        <div className="weather">
          <Weather />
        </div>
      </div>
      {/* LATEST SECTION */}
      <div className="sideAndMain">
        <div className="latest">
          <div className="heading">ताज़ा ख़बर</div>

          <div className="boxwrap">

            <div className="firstcard flex">
              <div className="imgcont">
                <img src={firstData?.thumbnail?.url} alt="news_thumbnail" />
              </div>

              <div className="cardHeadText flex">
                <div>
                  <Link to={"/article/"+firstData._id} className="headline">
                   {firstData?.headline}
                  </Link>
                </div>
                <div className="timeline">
                  Published: 17 Apr 2024 08:46 AM | Updated: 17 Apr 2024 11:29
                  AM
                </div>
              </div>
            </div>

            <div className="restCardsCont">
              {newsData?.map((data, i) => {
                return (
                  i>0 && <div key={data._id} className="rcard">
                    <img
                      src={data.imageUrl}
                      alt={data.headline}
                      className="squaredImage"
                    />
                    <div className="rheadtext">
                      <Link to={"/article/" + data._id} className="rheadline">
                        {data.headline}
                      </Link>
                      <div className="time">{data.time}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="sidebar ">
          <div className="heading">कानपुर लोकल</div>
          <ul className="list boxwrap">
            <li>
              <img
                src="https://img.icons8.com/fluency/30/manufacturing--v1.png"
                className="icon"
                alt="manufacturing"
              />
              About kanpur
            </li>
            <li>
              <img
                src="https://img.icons8.com/fluency/30/hindu-swastik.png"
                className="icon"
                alt="hindu-swastik"
              />
              Kanpur temples
            </li>
            <li>
              <img
                src="https://img.icons8.com/fluency/30/shop-location.png"
                className="icon"
                alt="shop-location"
              />
              Kanpur markets
            </li>
            <li>
              <img
                src="https://img.icons8.com/fluency/30/souvenirs.png"
                alt="souvenirs"
                className="icon"
              />
              Special places
            </li>
            <li>
              <img
                src="https://img.icons8.com/fluency/30/soup-plate.png"
                alt="soup-plate"
                className="icon"
              />
              Delicious food
            </li>
          </ul>
        </div>
      </div>

      {/* ELECTION */}
      <div style={{ marginTop: "20px" }} className="heading">
        लोकसभा चुनाव 2024
      </div>
      <CommonCate category={"Election"} quant={9} label={""} />

      <div style={{ marginTop: "20px" }} className="heading">
        Topics
      </div>
      <div className="topic-container">
        <CommonCate category={"Entertainment"} quant={5} label={"मनोरंजन"} />
        <CommonCate category={"Technology"} quant={5} label={"टेक ज्ञान"} />
        <CommonCate category={"Cricket"} quant={5} label={"क्रिकेट"} />
        <CommonCate category={"Business"} quant={5} label={"बिजनेस"} />
        <CommonCate category={"Education"} quant={5} label={"शिक्षा"} />
      </div>
    </div>
  );
}

export default Homepage;
// stock market data - 3IQYTBZMO8IVMW7J
