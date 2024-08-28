import React, {useEffect, useRef, useState} from "react";
import "./Article.css";
import BASE_URL from '../../baseUrl';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useUserContext } from "../../Context/user_context";


function Article() {

  const [newsData, setNewsData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const {articleId} = useParams();
  const [visible, setVisible] = useState(false);
  const divRef = useRef(null);
  const toast = useRef(null);
  const context = useUserContext();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const url = `${BASE_URL}news/getArticle?articleId=${articleId}`;
        const res = await axios.get(url);
        setNewsData(res.data.article); setError("");
      } catch (err) {
        setError("Error while fetching news data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();   
   
    window.scrollTo(0, 0);
  },[articleId]);

  const handleCopy = ()=>{
    let copyText = document.getElementById("copyInput");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(copyText.value);
    toast.current.show({ severity: 'success', summary: 'Link Copied.', detail: "Thankyou for sharing :)" });
  }

  const handleSave = ()=>{
    const saveArticle = async () => {
      try {
        const url = `${BASE_URL}save?articleId=${articleId}&userId=${context.user.userId}`;
        const res = await axios.post(url, { withCredentials: true });
        console.log(res);
        toast.current.show({ severity: 'success', summary: 'Save to your favourites.', detail: "We will save your articles for you." });
        setError("");
      } catch (err) {
        console.log(err);
      }
    };
    if(context.user){ saveArticle();  }
    else {
      toast.current.show({ severity: 'error', summary: 'Plase Login to save this article', detail: "It remembers your saved article when you logged in." });
    }
  }

  const handleVisibility = ()=>{
    setVisible(true);
  }

  useEffect(()=>{
    if (divRef.current) {
      divRef.current.innerHTML = newsData.content;
    }
  }, [newsData.content]);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="article-container" data-scroll-section>
      <Toast ref={toast} />
      <div className="articleAndButtons">
        <div className="buttons flex gap-2 mt-3">
          <Button icon="pi pi-bookmark" size="small" rounded outlined aria-label="Bookmark" onClick={handleSave}   />
          <Button icon="pi pi-share-alt" size="small" rounded outlined aria-label="Filter" onClick={handleVisibility} />
          <article>
            <Dialog  position="top" header="Share" visible={visible} style={{ width: '40vw' }} breakpoints={{ '960px': '75vw', '480px': '90vw' }} onHide={() => setVisible(false)}>
              <div className="m-0 flex gap-1 py-2">
                <input readOnly id="copyInput" style={{ userSelect: 'all', fontFamily : "Noto Sans"}} type="text" className="w-9 p-2 outline-none border-round border-1 " value={window.location.href} />
                <Button icon="pi pi-copy" label="Copy" onClick={handleCopy} />
              </div>
            </Dialog>
          </article>
        </div>
        <div className="article">
          <div className="headline">
           {newsData?.headline}
          </div>
          <img src={newsData?.thumbnail?.url} alt="article_image" className="article_image"/>
          <div className="text">
            <p>{newsData?.description} </p>
            <div ref={divRef}></div>
            <p>{newsData?.author}</p>
          </div>
        </div>
      </div>
    </div>
  );

}

export default Article;
