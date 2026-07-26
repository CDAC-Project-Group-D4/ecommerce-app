export const getCurrentUser= ()=>{
    const raw=localStorage.getItem("user");
    if(!raw){
        return null;
    }
    try{
        return JSON.parse(raw);
    }catch (err){
        console.error("Failed to parse user from localStorage:", err)
        return null;
    }
};
export const getCurrentUserId= ()=>{
    const user=getCurrentUser();
    return user ? user.userId:null;
}