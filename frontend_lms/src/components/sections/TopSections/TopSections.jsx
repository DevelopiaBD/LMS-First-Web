import React from 'react';
import './TopSections.css';

const TopSections = () => {
  return (
    <div className='topSectionsMainDiv'>
        <div className="topSections topSectionsOne">
            <h2 className="topSectionsShortTitle">LMS WEBSITE</h2>
            <h1 className="topSectionsMainTitle">শিক্ষা ব্যবস্থায় এলএমএস-এর গুরুত্ব</h1>
            <p className="topSectionsDescription">
            এলএমএস (লার্নিং ম্যানেজমেন্ট সিস্টেম) আধুনিক শিক্ষার একটি অপরিহার্য অংশ। এটি শিক্ষার্থীদের জন্য সহজে পাঠ্যবই, ভিডিও, কুইজ ও অন্যান্য শিক্ষাসামগ্রী অনলাইনে পাওয়ার সুযোগ করে দেয়। শিক্ষকরা সহজেই ক্লাস পরিচালনা, অ্যাসাইনমেন্ট জমা ও মূল্যায়ন করতে পারেন। এলএমএস ব্যবহারে শিক্ষার মান বৃদ্ধি পায় এবং শিক্ষার্থীরা নিজেদের গতিতে শিখতে পারে। এটি সময় ও খরচ কমিয়ে শিক্ষাকে আরও সহজলভ্য করে তোলে। বাংলাদেশের শিক্ষা ব্যবস্থায় এলএমএস প্রযুক্তি দ্রুত জনপ্রিয় হচ্ছে এবং ভবিষ্যতে আরও বিস্তৃতভাবে ব্যবহৃত হবে।
            </p>
        </div>


        <div className="topSections topSectionsTwo">
            <img
                src="https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=600&q=80"
                alt="Educational Illustration"
                className="topSectionsImage"
            />
        </div>
    </div>
  )
}

export default TopSections