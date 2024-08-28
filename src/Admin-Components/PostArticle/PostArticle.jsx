import React, {useState, useRef, useMemo} from "react";
import "./PostArticle.css";
import axios from "axios";
import BASE_URL from "../../baseUrl";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import JoditEditor from 'jodit-react';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { useNavigate } from "react-router-dom";
        
        
function PostArticle() {
  const [article, setArticle] = useState({
    headline: "",
    description: "",
    content: "",
    author: "",
    category: "",
  });
  const options =  ['paragraph','bold', 'italic',  'underline', 'strikethrough', '&&', 'ul', 'ol','&&', 'superscript', 'subscript', '&&', 'link', 'symbols', 'hr', 'table', '&&', 'spellcheck', 'fullsize','preview', 'print']
  const editor = useRef(null);
	const [content, setContent] = useState('');
	const config = useMemo( ()=>({  
      readonly: false,
      placeholder: 'Start typing...',
      buttons : options,
      buttonsMD: options,
      buttonsSM: options,
      buttonsXS: options,
      minHeight: 300,
    })
    ,
    // eslint-disable-next-line
    []
	);
  const navigate = useNavigate();
  const toast = useRef(null);
  const stepperRef = useRef(null);
  const [image, setImage] = useState(null);
  const [, setImagePreview] = useState(null);
  const [articleCategory, setArticleCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [posted, setPosted] = useState(false);
  const categories = [
    { name: "Entertainment"},
    { name: "Cricket"},
    { name: "Business"},
    { name: "Education"},
    { name: "Technology"},
  ];
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setArticle({
      ...article,
      [name]: value,
    });
  };

  const createmovieImagesChange = (e) => {
    const file = e.target.files[0];
    setImage([]);
    setImagePreview([]);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (reader.readyState === 2) {
        setImagePreview((old) => [...old, reader.result]);
        setImage((old) => [...old, reader.result]);
      }
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!article.headline || !article.author || !article.description || !articleCategory || !image || !content){
      toast.current.show({ severity: 'warn', summary: 'Missing required information', detail: 'Please fill all fields.' });
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.set("headline", article.headline);
    formData.set("description", article.description);
    formData.set("category", articleCategory.name);
    formData.set("author", article.author);
    formData.set("content", content);
    formData.set("posterImage", image[0]);

    // To check the entries of formData
    // for (let pair of formData.entries()) {
    //   console.log(pair[0], pair[1]);
    // }
    // return;

    axios.post(`${BASE_URL}/kanpurToday/api/v1/news/add`,formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        "type": "formData"
      }
    })
    .then((res)=>{
      console.log('Response data => ',res.data);
      setLoading(false);
      setPosted(true);
    })
    .catch((err)=>{
      console.log("Error aayi hai : ",err);
    });


  };

  const nextStep = ()=>{
    stepperRef.current.nextCallback();
  }

  const redirectPage = ()=>{
    setPosted(false);
    setArticle({
      headline: "",
      description: "",
      content: "",
      author: "",
      category: "",
    })
    setArticleCategory("");
    setImage(null);
    setImagePreview(null);
    navigate('/post-article');
    window.location.reload();
  }

  return (
    <div className="addArticleCont">
    <Toast ref={toast} />
    { 
    loading ? 
    <div className="loading flex flex-column gap-3 justify-content-center align-items-center h-25rem ">
    <ProgressSpinner style={{width: '80px', height: '80px'}} strokeWidth="4" fill="var(--surface-ground)" animationDuration=".7s" />
    <span>Posting your article</span>
    </div> 
    :
    <div className="customStepper" >
      { posted ? 
      <div className="posted flex flex-column gap-3 justify-content-center align-items-center h-25rem">
        <i className="pi pi-check" style={{fontSize : '3rem', color : "green"}}></i>
        Article posted successfully.
        <Button rounded="true" severity="secondary" label="Click to create one more" icon="pi pi-plus" onClick={redirectPage} />
      </div> 
      : 
      <Stepper ref={stepperRef} style={{  marginTop : '30px' }} >
          <StepperPanel header="Article Details">
              <div className="articleDetails" >
                <form className="flex flex-column gap-4" method="post" encType="multipart/form-data" >
                  <div className="flex gap-2 ">
                    <div className="p-fluid w-full input-field flex flex-column gap-1   ">
                      <span>Article Category</span>
                      <Dropdown required value={articleCategory} onChange={(e) => setArticleCategory(e.value)} options={categories} optionLabel="name" placeholder="Select category..." />
                    </div>
                  </div>

                  <div className="inputFieldsCont flex gap-2 ">
                    <div className="p-fluid cbox flex flex-column gap-1   ">
                      <div>Headline</div>
                      <InputText required value={article.headline} name="headline" onChange={handleChange} />
                    </div>
                    <div className="p-fluid cbox flex flex-column gap-1   ">
                      <span>Author</span>
                      <InputText required value={article.author} name="author" onChange={handleChange} />
                    </div>
                  </div>

                  <div className="w-full flex flex-column gap-1   ">
                      <span>Short Description</span>
                      <InputTextarea required value={article.description} name="description" onChange={handleChange} rows={5} />
                  </div>
                  
                  
                </form>
              </div>
              <div className="flex pt-4 justify-content-end">
                  <Button outlined="true" label="Next" icon="pi pi-arrow-right" iconPos="right" onClick={nextStep} />
              </div>
          </StepperPanel>
        
          <StepperPanel header="Write content">
              <div className="flex flex-column gap-3 ">
                <span>Write your article </span>
                <JoditEditor
                  ref={editor}
                  value={content}
                  config={config}
                  tabIndex={1}
                  // onBlur={newContent => setContent(newContent)}
                  onChange={newContent => setContent(newContent)}
                />        
              </div>
              <div className="flex pt-4 justify-content-between">
                  <Button outlined="true" label="Back" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current.prevCallback()} />
                  <Button outlined="true" label="Next" icon="pi pi-arrow-right" iconPos="right" onClick={() => stepperRef.current.nextCallback()} />
              </div>
          </StepperPanel>
          <StepperPanel header="Select thumbnail">
              <div className="flex flex-column gap-2">
                <div className="flex flex-column gap-3">
                  <span>Select article image</span>
                  <input required={true} onChange={createmovieImagesChange}
                  type="file" className="fileinput" accept="image/*" />
                </div>
                <div id="createmovieFormImage" className="prev-posterImg">
                  {image && <img src={image} alt="article Poster Preview" />}
                </div>
              </div>
              <div className="flex pt-4 justify-content-between">
                  <Button outlined="true" label="Back" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current.prevCallback()} />
                  <Button label="Post article" onClick={handleSubmit} icon="pi pi-send" iconPos="right"/>
              </div>
          </StepperPanel>
      </Stepper>}
    </div> 
    }
    </div>
  );
}

export default PostArticle;
