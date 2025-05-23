import { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Footer from '../footer/Footer';
import './Write.css';
import { fetchUserProfile } from '../../../features/authSlice';
import { addPost,fetchPosts } from '../../../features/postSlice';
import default_user from '../../../assets/image/user-1699635_1280.png'
import { useNavigate } from 'react-router-dom';
import { usePageContext } from '../../../app/PageContext';
import Modal from '../../../component/Modal';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // 스타일 import
import { useTranslation } from 'react-i18next';
import { AppDispatch,RootState } from '../../../app/store';


const Write = () => {
    const dispatch = useDispatch<AppDispatch>();
    const quillRef = useRef<ReactQuill | null>(null);
    const { user, userFetched } = useSelector((state:RootState) => state.auth);  
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [ modalOpen, setModalOpen ] = useState<boolean>(true);
    const navigate = useNavigate();
    const { currentPage } = usePageContext();
    const postsPerPage = 3;
    const today = new Date();
    const formattedDate = `${today.getDate()}.${today.getMonth()+1}.${today.getFullYear()}`

    //다국어 처리 
    const { t } = useTranslation();


    //로그인한 유저의 정보를 가져온다 
    useEffect(() => {
        if (user && !userFetched) { //로그인은 했는데 아직 유저 정보는 안갖고옴 
            dispatch(fetchUserProfile(user.id)); 
        }
    }, [dispatch, user, userFetched]);

    const handleCloseModal = () => {
        setModalOpen(false); 
        navigate('/signIn');
    }
    
    //로그인 상태가 아니여서 user가 없을 때 
    if (!user) {
        return <div>{modalOpen && (<Modal  message={t('please login')} onClose={handleCloseModal} />)}</div>

    }

    //게시물올리기 
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log('프로필 이미지:', user.profileImage); // 추가: 프로필 이미지 확인

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('author', user.nickname);
        if(user.profileImage) {
            formData.append('profilePicture', user.profileImage); 
        }

        dispatch(addPost(formData))
        
        .then((action) => {
            if (addPost.fulfilled.match(action)) {
                const newPost = action.payload; // 생성된 포스트 데이터
                console.log('새로 작성된 포스트:', newPost); // 콘솔에 출력
            }
            setTitle('');
            setContent('');      
            dispatch(fetchPosts({ page: currentPage, postsPerPage }));
            navigate('/'); // 작성 후 페이지 이동
        })
        .catch((error) => {
            console.error('Failed to submit post:', error);
        });
        
    };


    return (
        <div>       
            <div className='Write'>
                <div className='write-title'>
                    <div className='write-title-input'>
                        <form onSubmit={handleSubmit}>
                            <input type='text' 
                                className='write-title-inputbox'
                                placeholder='title'
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                />
                            
                            
                            {/* 구분선 */}
                            <div className='detail-divide'></div>  
                                

                                <ReactQuill      
                                    ref={quillRef}                          
                                    className="custom-quill"
                                    style={{ position : "relative", top : "50px", height : "400px"}}
                                    value={content}
                                    onChange={setContent}
                                    modules={{
                                        toolbar: [
                                            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                                            ['bold', 'italic', 'underline'],
                                            ['image', 'code-block'],
                                            ['clean']                                         
                                        ],
                                    }}
                                />
                        <button type='submit' className='write-submit-btn'>submit</button>
                        </form>
                        
                    </div> 
                </div>

               
                <div className='write-detail-author-info'>
                    <div className='w-detail-author-profile'>
                        <img className='w-profileImg' src={user.profileImage || default_user } alt="Profile" />
                    </div>
                    <div>
                        <div className='w-detail-author-id'>{user.nickname}</div>
                        <div className='w-detail-author-date'>{formattedDate}</div>
                    </div>
                </div>                    
                             
            </div>

            <Footer />
        </div>
    )       
}

export default Write;
