<template>
  <div id="playerSearch">
    <div class= "searchBar">      
      <label><em>Player Name: </em></label>
      <input v-model="searchQuery" type="text" name="">
      <button v-on:click="search(searchQuery)">search</button>
    </div>
    <table>
      <caption v-if="searchResults.length > 0"><span><button v-on:click="previousPage()"><</button></span> Page {{page+1}} of {{Math.floor(searchResults.length/10)}} <span><button v-on:click="nextPage()">></button></span></caption>
      <tr>
        <th>Add</th>
        <th>Required</th>
        <th>Name</th>
        <th>Rating</th>
        <th>Location</th>
      </tr>      
      <tr v-for="entry in searchResults.slice(page*10, ((page+1)*10))">
        <td><button v-on:click="addRoster(entry,false)">+</button></td>
        <td><button v-on:click="addRoster(entry,true)">☆</button></td>
        <td>{{entry.firstName}} {{entry.lastName}}</td>
        <td>{{entry.rating}}</td>
        <td>{{entry.location}}</td>
      </tr>
    </table>
    <hr>
    <h2>Roster Pool</h2>
    <div class="roster">
      <div v-bind:class="{required:entry.required}" class="rosterItem" v-on:click="remove(entry)" v-for="entry in roster"><b>{{entry.firstName}}</b>({{entry.rating}})</div>
    </div>
    <hr>
    <h2>Events</h2>
    <div class="searchBar">      
      <label >Cap: </label>
    </div>
    <table>
      <tr><th>Description</th><th>Cap</th>
        <td># Players</td><th>Remove</th></tr>
        <tr>
      <td><input v-model="eventDescription" type="Description" name=""></td> 
      <td><input v-model="eventCap" type="number" name=""></td>     
      <td><input v-model="eventNum" type="Description" name=""></td>
      <td><button v-on:click="addEvent(eventCap,eventDescription,eventNum)">Add</button></td></tr>
      <tr v-for="event in events">
        <td>{{event.description}}</td>
        <td>{{event.cap}}</td>
        <td>{{event.num}}</td>
        <td><button v-on:click="removeEvent(event)">X</button></td>
      </tr>
    </table>

    <hr>
    <h2>Teams:</h2>
    <div class="searchBar">
      <button v-on:click="calcTeams()">Calculate Teams</button>
    </div>
    <div class="roster">
      <table>
        <tr>
          <th>Event</th>
          <th>Rating</th>
          <th>Cap</th>
          <th>Roster</th>
        </tr>      
        <tr v-for="team in teams">
          <td>{{team.event_obj.description}}</td>
          <td>{{team.combined}}</td>
          <td>{{team.cap}}</td>
          <td><span v-for="member in team.roster">{{member.firstName}}  </span></td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  components: {
    
  },
  data(){
    return{
      searchQuery:"",
      searchResults:[],
      roster:[],
      required:[],
      submitting :false,
      page:0,
      eventDescription:"",
      eventCap:0,
      events:[{
        description:"Elite Teams",
        cap:1900,
        num:3},{
        description:"Plat Teams",
        cap:2275,
        num:4},{
        description:"Gold Teams",
        cap:2050,
        num:4},{
        description:"Silver Teams",
        cap:1825,
        num:4},{
        description:"Bronze Teams",
        cap:1600,
        num:4},{
        description:"Elite Scotch",
        cap:1300,
        num:2},{
        description:"Plat Scotch",
        cap:1100,
        num:2},{
        description:"Gold Scotch",
        cap:1000,
        num:2},{
        description:"Silver Scotch",
        cap:900,
        num:2},{
        description:"Bronze Scotch",
        cap:800,
        num:2}
        ],
      teams:[],
      eventNum:2
    }
  },
  methods:{
    search:function(q){
      var that = this;
      if(!that.submitting){
          that.page = 0;
         that.submitting = true;
         that.$axios({
          method:'get',
          url:'https://dashboard.fargorate.com/api/indexsearch',
          params:{
            q:q        
          }
        })
        .then(function (response) {
          console.log(response);
          that.searchResults = response.data.value;
          if(response.status == 200){
            setTimeout(()=>{
            that.submitting = false;
            },200)
          }
        })
        .catch(function (error) {
          that.searchResults = []
          that.submitting = false;
          console.log(error);
        });    }
    },
    calcTeams:function(){
      var that = this;
      that.teams = [];
      this.events.forEach(function(e){
        var permutations = k_combinations(that.roster,e.num);
        var cap = e.cap;
        permutations.forEach(function(p){
          // add in code for making sure a team comp includes all required individuals
          var sum = 0;
          var contains_required = true;
          p.forEach(function(member){
            sum += parseInt(member.rating);
            that.required.forEach(function(r){
              if(!p.includes(r)){
                contains_required=false;
              }
            });
          });          



          if(sum < cap && contains_required && Math.abs(sum-cap) < 100){
            that.teams.push({
              event_obj:e,
              roster:p,
              combined:sum,
              cap:cap
            });
          }
        }); 

        that.teams.sort(
            (a,b)=>(Math.abs(a.combined-a.cap) < Math.abs(b.combined-b.cap))? -1:1
          );

      });
    },

    addRoster:function(entrant,req){
      entrant.required = req;
      if(!this.roster.includes(entrant)){
        this.roster.push(entrant);
        if(req){
          this.required.push(entrant);
        }
      }
    },
    addEvent:function(cap,desc,num){
      cap = parseInt(cap)
      if(desc == '')desc = "unnamed"
      this.events.push({cap:cap,description:desc,num:num})
    },
    removeEvent:function(event){
      var index = this.events.indexOf(event);
 
      if (index > -1) {
         this.events.splice(index, 1);
      }
    },
    remove:function(entrant){
      var index = this.roster.indexOf(entrant);
 
      if (index > -1) {
         this.roster.splice(index, 1);
      }

      index = this.required.indexOf(entrant);
      if(index >-1){
        this.required.splice(index,1);
      }
    },
    nextPage:function(){
      this.page ++;
      var limit = Math.floor(this.searchResults.length /10);
      if(this.page >= limit){
        this.page = limit-1;
      }
    },

    previousPage:function(){
      this.page --;
      this.page = Math.max(this.page,0);
    },

  }
}

function k_combinations(set, k) {
  var i, j, combs, head, tailcombs;
  if (k > set.length || k <= 0) {
    return [];
  }
  
  if (k == set.length) {
    return [set];
  }
  
  if (k == 1) {
    combs = [];
    for (i = 0; i < set.length; i++) {
      combs.push([set[i]]);
    }
    return combs;
  }  
  combs = [];
  for (i = 0; i < set.length - k + 1; i++) {
    // head is a list that includes only our current element.
    head = set.slice(i, i + 1);
    // We take smaller combinations from the subsequent elements
    tailcombs = k_combinations(set.slice(i + 1), k - 1);
    // For each (k-1)-combination we join it with the current
    // and store it to the set of k-combinations.
    for (j = 0; j < tailcombs.length; j++) {
      combs.push(head.concat(tailcombs[j]));
    }
  }
  return combs;
}

function perm(xs) {
      let ret = [];
 
      for (let i = 0; i < xs.length; i = i + 1) {
        let rest = perm(xs.slice(0, i).concat(xs.slice(i + 1)));

        if(!rest.length) {
          ret.push([xs[i]])
        } else {
          for(let j = 0; j < rest.length; j = j + 1) {
            ret.push([xs[i]].concat(rest[j]))
          }
        }
      }
      return ret;
    }
</script>

<style>

.searchBar{
  text-align: left;
  margin:25px 0;
}
.roster{
  display:flex;
  flex-flow: row wrap;
}

.rosterItem{
  border-radius:5px;
  padding:5px;
  margin:5px;
  background-color: rgba(0,0,0,.1)
}
.rosterItem:hover{
  background-color: rgba(0,0,0,.2)
}

.required{
  background-color: rgba(255,0,0,.3)
}
.required:hover{
  background-color: rgba(255,0,0,.5)
}

#playerSearch {
}

table{
  width:100%;
  text-align: left;
}

tr:nth-child(odd){
  background-color:rgba(0,0,0,.1);
}


</style>
