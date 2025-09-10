import React from "react";

const styles = `
.loading-anim__container {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    background: #f8fafc;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}
.loading-anim__spinner {
    display: flex;
    gap: 0.7rem;
}
.loading-anim__dot {
    width: 1.2rem;
    height: 1.2rem;
    border-radius: 50%;
    background: #2563eb;
    opacity: 0.7;
    animation: loading-anim-bounce 1.2s infinite ease-in-out;
}
.loading-anim__dot:nth-child(2) {
    animation-delay: 0.2s;
}
.loading-anim__dot:nth-child(3) {
    animation-delay: 0.4s;
}
@keyframes loading-anim-bounce {
    0%, 80%, 100% {
        transform: scale(0.8);
        opacity: 0.7;
    }
    40% {
        transform: scale(1.2);
        opacity: 1;
    }
}
`;

const LoadingAnim = () => (
    <>
        <style>{styles}</style>
        <div className="loading-anim__container">
            <div className="loading-anim__spinner">
                <div className="loading-anim__dot"></div>
                <div className="loading-anim__dot"></div>
                <div className="loading-anim__dot"></div>
            </div>
        </div>
    </>
);

export default LoadingAnim;