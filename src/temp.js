thing="Hello World!"
thing2="Farewell, Cruel World!"
thing3="Mars"
thing4="Neptune"
var json ={"names":[{"Name":"Tom","Age":33},{"Name":"Tom","Age":73},{"Name":"Dick","Age":43},{"Name":"Harry","Age":53}]}
//aThing2={thing3,thing4}
//myArray=[aThing,aThing2]
//console.log(json.names[0])

var newArray = json.names.filter(function (el) {
    return el.Age <= 60 &&
        el.Name=="Harry"
  });
//console.log(newArray[0]);

function filterByName(obj,val){
    var names = obj.names;
    return names.filter(function (el){
        return el.Name==val;
    }
    )
}

const suit="Tom";
const filtered = json.names.filter((el) => {
    return el.Name==suit;
});



console.log(filtered);
//console.log(filterByName(json,"Tom"))
