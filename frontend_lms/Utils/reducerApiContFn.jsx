import React from 'react'

const reducerApiContFn = (state, action) => {


    switch (action.type) {
        case 'Set_Load_Get_User':
            return { ...state, ApiLoading: true, ApiError: false };
        case 'STOP_Load_Get_User':
            return { ...state, ApiLoading: false, ApiError: false };
        case 'Set_Error_Get_User':
            return { ...state, ApiLoading: false, ApiError: true};



        case 'Set_Load_Course_Get':
            return { ...state, CourseLoading: true, CourseError: false, };
        case 'STOP_Load_Course_Get':
            return { ...state, CourseLoading: false, CourseError: false };
        case 'Set_Error_Course_Get':
            return { ...state, CourseLoading: false, CourseError: true};



        default:
            return state;
    }

}

export default reducerApiContFn