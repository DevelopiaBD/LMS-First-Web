import React, { useState, useEffect, useRef } from 'react';
import './EducationalSlider.css';

// Placeholder images for the educational model slider
// NOTE: In a real project, these would be imported from your assets folder.
const educationalImages = [
    {
        id: 1,
        src: "https://placehold.co/200x400/9b59b6/ffffff?text=Lesson+1",
        alt: "Educational model for Lesson 1",
        title: "Lesson 1: Foundations",
        description: "Master the <span class='highlight'>core fundamentals</span> to build a strong base.",
    },
    {
        id: 2,
        src: "https://placehold.co/200x400/2980b9/ffffff?text=Module+B",
        alt: "Educational model for Module B",
        title: "Module B: <span class='highlight'>Advanced</span> Concepts",
        description: "Dive deep into complex topics with our interactive guides.",
    },
    {
        id: 3,
        src: "https://placehold.co/200x400/2ecc71/ffffff?text=Practical+Skills",
        alt: "Educational model for Practical Skills",
        title: "Hands-on <span class='highlight'>Practice</span>",
        description: "Apply your knowledge with <span class='highlight'>real-world projects</span>.",
    },
    {
        id: 4,
        src: "https://placehold.co/200x400/e67e22/ffffff?text=Certification",
        alt: "Educational model for Certification",
        title: "Achieve Your <span class='highlight'>Goal</span>",
        description: "Unlock your potential and get <span class='highlight'>certified</span> today.",
    },
];

function EducationalSlider() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const timeoutRef = useRef(null);

    const resetTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };

    useEffect(() => {
        resetTimeout();
        timeoutRef.current = setTimeout(
            () =>
                setCurrentSlide((prevSlide) =>
                    prevSlide === educationalImages.length - 1 ? 0 : prevSlide + 1
                ),
            5000
        );

        return () => {
            resetTimeout();
        };
    }, [currentSlide]);

    const nextSlide = () => {
        setCurrentSlide((prevSlide) =>
            prevSlide === educationalImages.length - 1 ? 0 : prevSlide + 1
        );
    };

    const prevSlide = () => {
        setCurrentSlide((prevSlide) =>
            prevSlide === 0 ? educationalImages.length - 1 : prevSlide - 1
        );
    };

    return (
        <div className="slider-container">
            <div className="slider-wrapper">
                <div
                    className="slide-content"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {educationalImages.map((image) => (
                        <div
                            key={image.id}
                            className="slide-item"
                            style={{ backgroundImage: `url(${image.src})` }}
                        >
                            <div className="text-overlay">
                                <h3 dangerouslySetInnerHTML={{ __html: image.title }}></h3>
                                <p dangerouslySetInnerHTML={{ __html: image.description }}></p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="slider-controls">
                <button onClick={prevSlide} className="prev-arrow" aria-label="Previous Slide">
                    &#10094;
                </button>
                <button onClick={nextSlide} className="next-arrow" aria-label="Next Slide">
                    &#10095;
                </button>
            </div>

            <div className="slider-dots">
                {educationalImages.map((_, index) => (
                    <span
                        key={index}
                        className={`dot ${currentSlide === index ? 'active' : ''}`}
                        onClick={() => setCurrentSlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                    ></span>
                ))}
            </div>
        </div>
    );
}

export default EducationalSlider;
