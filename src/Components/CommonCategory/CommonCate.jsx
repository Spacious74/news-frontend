import React, {useState, useEffect} from 'react';
import BASE_URL from '../../baseUrl';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './CommonCate.css';

function CommonCate({category, quant, label}) {
    const [newsData, setNewsData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
  
    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const url = `${BASE_URL}news/category?category=${category}&quantity=${quant}`;
          const res = await axios.get(url);
          setNewsData(res.data.articles);
          setError("");
        } catch (err) {
          console.error(err);
          setError("Error fetching news data");
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, [category, quant]);
  
    if (loading) {
      return <div>Loading...</div>;
    }
  
    if (error) {
      return <div>{error}</div>;
    }

  return (
    <div className="topic boxwrap">
    <div className="head">{label}</div>
    <div className="restCardsCont">
      {newsData?.map((data, i) => {
        return (
            <div key={i} className="rcard flex" id={data._id}>
              <img
                src={data.thumbnail.url}
                alt={data._id}
                className="squaredImage"
              />
              <div className="rheadtext">
                <Link to={"article/" + data._id} className="rheadline">
                  {data.headline}
                </Link>
                <div className="time">{data.createdAt}</div>
              </div>
            </div>
        );
      })}
    </div>
    <button className="readMoreBtn">Read full coverage...</button>
  </div>
  )
}

export default CommonCate
