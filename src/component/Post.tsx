import { Link } from 'react-router-dom';
import React from 'react';
import './Post.css';
import { useTranslation } from 'react-i18next';
import default_user from '../assets/image/user-1699635_1280.png'
import { Post as PostType } from 'types/PostType'; 

interface PostProps {
    post: PostType | null; 
}


const Post: React.FC<PostProps> = ({ post }) => {
    const { t } = useTranslation();

    if (!post) {
        return null; // 게시글이 없는 경우 null 반환
    }
    const commentCount =  (post.comments && post.comments.length > 0) ? post.comments.length : 0;
    const id = post._id;

    // 이미지 태그를 제외한 텍스트만을 추출
    const getPreviewText = (content: string): string => {
        // 이미지 태그를 정규 표현식으로 제거
        const textOnly = content.replace(/<img[^>]*>/g, ''); // 이미지 태그 제거
    
        // HTML 태그를 제거하여 순수 텍스트만 남김
        const tempElement = document.createElement('div');
        tempElement.innerHTML = textOnly;
        const plainText = tempElement.textContent || tempElement.innerText || '';
    
        // 70자 이내로 자르고 '...' 추가
        return plainText.length > 70 ? plainText.slice(0, 70) + '...' : plainText;
    };
    
    // 사용 예시
    const previewText = getPreviewText(post.content);
    
    


    return (
        <div className="Post-container">
            <div className='Post'>   
                <div className='Post-content'>         
                    <div className='Post-top'>
                        <div className='Post-img'><img className='Post-profile-img' src={post.profileImage ? post.profileImage : default_user} alt={post.author} /></div>
                        <div className='Post-user-info'> 
                            <div className='Post-id'>{post.author}</div>
                            {/* 일/월/년 순으로  */}
                            <div className='Post-date'>
                                {new Date(post.createdAt ?? '').toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short', // 월을 약어로 표시
                                day: '2-digit'
                                })}
                            </div> 
                        </div>
                    </div>
                    
                    <div className='Post-mid'>
                        <div className='Post-mid-title'>
                            <Link to={`/detail/${id}`}
                                style={{ textDecoration: "none", color: "black"}}
                            >
                                {post.title}
                            </Link>
                        </div> 
                        <div className='Post-mid-content'>
                            {/* 마크다운이나 HTML을 처리할 수 있는 방법을 통해 변환된 내용을 렌더링 */}
                            <span dangerouslySetInnerHTML={{ __html: previewText }} />
                        </div>
                    </div>

                    <div className='Post-btm'>
                        <div>{t('comment')}{commentCount} ·</div>
                        <div>{t('like')} {post.like} ·</div>
                        <div>{t('view')} {post.views}</div>    
                    </div>
                </div> 
            </div>
    </div>
    );
};

export default Post;