var urlSenate = 'https://api.propublica.org/congress/v1/113/senate/members.json';   
var urlHouse = 'https://api.propublica.org/congress/v1/113/house/members.json';

if (document.title.includes('Senate')) {
    console.log('use senate data');
    url = urlSenate;
} 

if (document.title.includes('House')) {
    console.log('use house data');
    url = urlHouse;
}

var request = {
        method: 'GET',
        headers: {
            'X-API-KEY': 'AnhSDU3Px44f459F8NFIn15ibKvCRdPC7l8f97MG'
        }
        };

var app = new Vue({
    el: '#app',
    data: {
        senators: [],
        stateList: [],
        selectedParties: [],
        selectedState: 'All',
    },
    methods: {
        fetchData: function() {
            fetch(url, request)
            .then(response => {
                return response.json();
            })
            .then(data => {
                this.senators = data.results[0].members;
                this.getStates();
            })
            .catch(err => {
                console.log(err);
            })
        },
        getStates: function() {
            let states = [];

            this.senators.forEach(function(senator) {
                let stateCode = senator.state;
                if (states.includes(stateCode) === false) {
                    states.push(stateCode);
                }
            })
            
            states.sort();
            this.stateList = states;
            
            return this.stateList;
        },
    },
    created: function() {
        this.fetchData();
    },
    computed: {
        filterMembers: function() {                        
            return this.senators.filter(senator => {
                let partyFilterValue = this.selectedParties.length == 0 || this.selectedParties.includes(senator.party);
                let stateFilterValue = this.selectedState == 'All' || this.selectedState == senator.state;
                
                return partyFilterValue && stateFilterValue;
            })
        }
    }
})





























