import './Header.css';
import React, { KeyboardEvent, ChangeEvent } from 'react';
import search from '../../assets/image/search-icon.png';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../features/authSlice';
import { useState } from 'react';
import { fetchSearchedPosts } from '../../features/postSlice';
import korea from '../../assets/image/south-korea.png';
import english from '../../assets/image/united-kingdom.png';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../locales/LanguageContext.js';
import { AppDispatch, RootState } from '@/app/store';


const Header = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    //서치바
    const [clickSearchIcon, setClickSearchIcon] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState<string>('');
    const [searchOption, setSearchOption] = useState<string>('all');

    const { t } = useTranslation();
    const { changeLanguage } = useLanguage();
    const [openLanguage, setOpenLanguage] = useState<boolean>(false);

    //get the logging user from Redux
    const user = useSelector((state: RootState) => state.auth.user);

    const onNavigate = () => {
        navigate("/signin");
    }

    const handleLogout  = async () => {
        await dispatch(logoutUser());
        onNavigate(); 
    };
    
    //search bar 돋보기 누르면 서치바 나옴 
    const handleSearchBar = () => {
        setClickSearchIcon((click) => !click);
    }
    // language 토글 
    const handleLangBar = () => {
        setOpenLanguage((click) => !click);
    }

    const handleSearchOptionChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setSearchOption(event.target.value);
    };

    const handleSearchValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
    };

    
    //검색버튼을 누르면 fetchSearchedPosts호출 
    const handleSearch = () => {
        console.log("searchValue",searchValue);
        dispatch(fetchSearchedPosts({ searchTerm: searchValue, searchOption }));
        navigate("/search");
        setSearchValue('');
        setClickSearchIcon(false);
    };

    const handleKeyDown = (e:KeyboardEvent <HTMLInputElement> ) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };
    
    return(       
        <div className="Header">

            <div className="header-container1">
                <div className="left-img">✍️</div>
                <div className="left-title"><Link to={'/'} style={{ textDecoration: "none", color: "black"}}>{t('Board')}</Link></div>
            </div>
            
            <div className="header-container2">
                {clickSearchIcon && (
                    <div className='search-bar-container'>
                        <select value={searchOption} onChange={handleSearchOptionChange} className='search-option'>
                            <option value="all">{t('all')}</option>
                            <option value="title">{t('title')}</option>
                            <option value="content">{t('content')}</option>
                            <option value="author">{t('nickname')}</option>
                        </select>
                        <input 
                            type='text' 
                            placeholder='search here' 
                            value={searchValue} 
                            onChange={handleSearchValueChange} 
                            className='search-bar'
                            onKeyDown={handleKeyDown}
                        />
                        <button 
                        type='button' 
                        onClick={handleSearch} 
                        className='search-button'
                        style={{cursor:'pointer'}}
                        >
                            {t('search')}
                        </button>
                    </div>
                )}
                <div className="search-icon" onClick={handleSearchBar} style={{cursor:'pointer'}}><img src={search} alt='search-icon'/></div>
                
                
                {user ? (
                    <>
                        <Link to={'/'}
                            style={{ textDecoration: "none", color: "black" }}
                        >
                            <button onClick={handleLogout} className='logout-btn'>
                                {t('logout')}
                            </button>
                        </Link>
                        <Link to={'/mypage'}
                            style={{ textDecoration: "none", color: "black" }}
                        >
                            <button className='mypage-btn'> 
                                {t('mypage')}
                            </button>
                        </Link>
                    </>
                ) : (
                    <>
                        <Link to={'/signin'} 
                        style={{ textDecoration: "none", color: "black"}}
                        >
                        <button type='submit' className="login-btn">
                            {t('login')}
                        </button>
                        </Link>
                    </>
                )}
                <div>
                    <div className='language' onClick={handleLangBar}>language</div>
                    {openLanguage === true && (
                        <div className='language-container'>
                            <p className='lang-kor' onClick={() => changeLanguage('ko')}><img src={korea} alt='korea'/></p>
                            <p className='lang-eng' onClick={() => changeLanguage('en')}><img src={english} alt='english'/></p>
                        </div>
                    )}
                    
                </div>
            </div>
            
            
        </div>           
    )
}
export default Header;