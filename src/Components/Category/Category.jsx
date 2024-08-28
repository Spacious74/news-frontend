import React, {useState, useEffect, useRef} from 'react';
import "./Category.css";
import { Link } from "react-router-dom";
import BASE_URL from '../../baseUrl';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function Category() {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalArticles , setTotal] = useState(10);
  const {category} = useParams();
  let [page, setPage] = useState(1);
  const pageSize = 10;
  useEffect(()=>{
    setPage(1);
    setTotal(10);
  },[category]);
  const scrollRef = useRef(null);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const url = `${BASE_URL}news/load?category=${category}&page=${page}&pageSize=${pageSize}`;
        const res = await axios.get(url);
        setTotal(res.data.totalArticles);
        (page === 1)?
        setNewsData(res.data.articles) :
        setNewsData(prevDataArray => [...prevDataArray, ...res.data.articles]);
        setError("");
       
        if (scrollRef.current !== null) {
          window.scrollTo(0, scrollRef.current);
        }

      } catch (err) {
        console.error(err);
        setError("Error while fetching news data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category, page]);

  const handleLoadMore = () => {
    scrollRef.current = window.pageYOffset;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  return (
    <div className="wrapper">
      <div className="sideAndMain">
        <div className="main_category">
          <div className="category_name">{category}</div>
          <div className="restCardsCont boxwrap">
            {newsData?.map((data, i) => {
              return (
                <div key={i} className="rcard flex" id={data.id}>
                  <img
                    src={data.thumbnail.url}
                    alt={data.id}
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
            {(totalArticles)? <button className="readMoreBtn" onClick={()=>{setPage(page+1); handleLoadMore()}}>Load more...</button> : ""} 
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
              Kanpur's Iconic food
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Category;
