import {
  USERS_DATA_STATE_CHANGE,
  USERS_POSTS_STATE_CHANGE,
  CLEAR_DATA,
} from "../constants";

// 초기 state 값
const initialState = {
  users: [],
  usresFollowingLoaded: 0,
};

// reducer (users)
export const users = (state = initialState, action) => {
  switch (action.type) {
    // 유저들 정보를 업데이트
    case USERS_DATA_STATE_CHANGE:
      return {
        ...state,
        users: [...state.users, action.user],
      };
    // 유저들 중 특정 유저의 포스트를 변경
    case USERS_POSTS_STATE_CHANGE:
      return {
        ...state,
        usresFollowingLoaded: state.usresFollowingLoaded + 1,
        users: state.users.map((user) =>
          user.uid === action.uid ? { ...user, posts: action.posts } : user
        ),
      };
    case CLEAR_DATA:
      return {
        users: [],
        usresFollowingLoaded: 0,
      };
    default:
      return state;
  }
};
