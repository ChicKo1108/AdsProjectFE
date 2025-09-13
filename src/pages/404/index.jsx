import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

function NotFound() {
  return (
    <div className="not-found">
      <div className="not-found-container">
        <h1 className="not-found-code">404</h1>
        <h2 className="not-found-title">页面未找到</h2>
        <p className="not-found-description">
          抱歉，您访问的页面不存在或已被移动。
          <br />
          请检查URL是否正确，或返回首页继续浏览。
        </p>
        <Link to="/" className="not-found-button">
          <span className="not-found-icon">🏠</span>
          返回首页
        </Link>
      </div>
    </div>
  );
}

export default NotFound;