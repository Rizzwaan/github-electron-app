const initialState = {
   isRepoRecieved: false,
   recentFiles: [],
   searchString: '',
   initRepoFilePath: '',
   newRepoName:'',
};

const reducer = (state = initialState, action ) => {
   let newState = {...state};
   if( action.type === "REPO_RECIEVED"){
     newState.isRepoRecieved = action.value;
   }
   if( action.type === "GET_RECENT_FILES"){
      newState.recentFiles = action.payload;
   }
   if( action.type === "SEARCH_CHANGE"){
      newState.searchString = action.payload;
   }
   if( action.type === "GET_NEW_REPO_PATH"){
      newState.initRepoFilePath = action.payload;
   }
   if( action.type === "NEW_REPO_NAME"){
      newState.newRepoName = action.payload;
   }
   return newState;
}

export default reducer;
