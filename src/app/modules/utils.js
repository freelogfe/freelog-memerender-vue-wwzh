export function getCookie (name){

    var regExpStr = `^\\s*${name}=` 
    var regE = new RegExp(regExpStr)
    var arr = document.cookie.split(';')
    arr = arr.filter(it => regE.test(it))
    
    if(arr.length){
        arr = arr[0].split('.')
        if(arr.length > 1){
            return arr[1].replace(regE, '')
        }
    }

    return null
    
}

export function getUserId (){
    var authInfo = getCookie('authInfo')
    
    authInfo = window.atob(authInfo)

    try{
      authInfo = JSON.parse(authInfo)
      return authInfo.userId
    }catch(e){
      return null
    }
  }