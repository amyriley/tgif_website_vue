var app = new Vue({
    el: '#app',
    data: {
        senators: [],
        stateList: [],
        selectedParties: [],
        selectedState: 'All',
        leastEngaged: [],
        mostEngaged: [],
        leastLoyal: [],
        mostLoyal: [],
        totalDemocrats: 0,
        totalRepublicans: 0,
        totalIndependents: 0,
        totalMembers: 0,
        averagePercentageDemocrats: 0,
        averagePercentageRepublicans: 0,
        averagePercentageIndependents: 0,
        totalAveragePercentage: 0,
        loading: false,
    },
    methods: {
        fetchData: function () {

            var request = {
                method: 'GET',
                headers: {
                    'X-API-KEY': 'AnhSDU3Px44f459F8NFIn15ibKvCRdPC7l8f97MG'
                }
            };

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
            
            console.log('loading');
            this.loading = true;
            
            fetch(url, request)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    this.loading = false;
                    console.log('loaded');
                    this.senators = data.results[0].members;
                    this.getStates();
                    this.getTotalDemocrats();
                    this.getTotalRepublicans();
                    this.getTotalIndependents();
                    this.getTotalMembers();
                    this.getAveragePercentageDemocrats();
                    this.getAveragePercentageRepublicans();
                    this.getAveragePercentageIndependents();
                    this.getTotalAveragePercentage();
                    this.getLeastLoyalMembers();
                    this.getMostLoyalMembers();
                    this.getLeastEngagedMembers();
                    this.getMostEngagedMembers();
                })
                .catch(err => {
                    console.log(err);
                })
        },
        getStates: function () {
            let states = [];

            this.senators.forEach(function (senator) {
                let stateCode = senator.state;
                if (states.includes(stateCode) === false) {
                    states.push(stateCode);
                }
            })

            states.sort();
            this.stateList = states;

            return this.stateList;
        },
        getPartyMemberList: function (partyIndicator) {
            var memberList = [];

            for (i = 0; i < this.senators.length; i++) {
                if (this.senators[i].party.includes(partyIndicator)) {
                    memberList.push(this.senators[i]);
                }
            }

            return memberList;
        },
        getTotalDemocrats: function () {
            this.totalDemocrats = this.getPartyMemberList('D').length;

            return this.totalDemocrats;
        },
        getTotalRepublicans: function () {
            this.totalRepublicans = this.getPartyMemberList('R').length;

            return this.totalRepublicans;
        },
        getTotalIndependents: function () {
            this.totalIndependents = this.getPartyMemberList('I').length;

            return this.totalIndependents;
        },
        getTotalMembers: function () {
            this.totalMembers = this.senators.length;

            return this.totalMembers;
        },
        getAveragePercentPartyVotes: function (partyIndicator) {
            var totalMembersList = this.getPartyMemberList(partyIndicator);
            var totalPercentage = 0;

            for (i = 0; i < this.senators.length; i++) {

                if (this.senators[i].party.includes(partyIndicator)) {
                    var percentage = this.senators[i].votes_with_party_pct;
                    totalPercentage = totalPercentage + percentage;
                }
            }

            var averagePercentage = totalPercentage / totalMembersList.length;

            if (isNaN(averagePercentage)) {
                averagePercentage = '0';
            }

            return averagePercentage;
        },
        getAveragePercentageDemocrats: function () {
            this.averagePercentageDemocrats = this.getAveragePercentPartyVotes('D').toFixed(2);

            return this.averagePercentageDemocrats;
        },
        getAveragePercentageRepublicans: function () {
            this.averagePercentageRepublicans = this.getAveragePercentPartyVotes('R').toFixed(2);

            return this.averagePercentageRepublicans;
        },
        getAveragePercentageIndependents: function () {
            
            var totalIndependents = this.totalIndependents;
            
            if (totalIndependents < 1) {
                this.averagePercentageIndependents = 0;
            } else {
                this.averagePercentageIndependents = this.getAveragePercentPartyVotes('I').toFixed(2);
            }

            return this.averagePercentageIndependents;
        },
        getTotalAveragePercentage: function () {
            var averagePercentage = ((this.getAveragePercentPartyVotes('D') + this.getAveragePercentPartyVotes('R') + this.getAveragePercentPartyVotes('I')) / 3).toFixed(2);

            if (this.getAveragePercentPartyVotes('I') == 0) {
                averagePercentage = ((this.getAveragePercentPartyVotes('D') + this.getAveragePercentPartyVotes('R')) / 2).toFixed(2);
            }
            
            this.totalAveragePercentage = averagePercentage;
            
            return this.totalAveragePercentage;
        },
        getLeastLoyalMembers: function () {
            var leastLoyalMembers = [];
            var membersCopy = this.senators.slice(0);

            var sortedMembers = membersCopy.sort(function (a, b) {
                return a.votes_with_party_pct - b.votes_with_party_pct;
            });

            for (var i = 0; i < sortedMembers.length; i++) {
                var tenPercent = (sortedMembers.length) * 0.1;

                if (leastLoyalMembers.length <= tenPercent) {
                    leastLoyalMembers.push(sortedMembers[i]);
                }
            }

            var lastElement = leastLoyalMembers[leastLoyalMembers.length - 1];

            for (var j = sortedMembers.indexOf(lastElement); j < sortedMembers.length; j++) {
                if (lastElement.votes_with_party_pct === sortedMembers[j].votes_with_party_pct && lastElement != sortedMembers[j]) {
                    leastLoyalMembers.push(sortedMembers[j]);
                }
            }

            this.leastLoyal = leastLoyalMembers;
            return this.leastLoyal;
        },
        getMostLoyalMembers: function () {
            var mostLoyalMembers = [];
            var membersCopy = this.senators.slice(0);

            var sortedMembers = membersCopy.sort(function (a, b) {
                return b.votes_with_party_pct - a.votes_with_party_pct;
            });

            for (var i = 0; i < sortedMembers.length; i++) {
                var tenPercent = (sortedMembers.length) * 0.1;

                if (mostLoyalMembers.length <= tenPercent) {
                    mostLoyalMembers.push(sortedMembers[i]);
                }
            }

            var lastElement = mostLoyalMembers[mostLoyalMembers.length - 1];

            for (var j = sortedMembers.indexOf(lastElement); j < sortedMembers.length; j++) {
                if (lastElement.votes_with_party_pct === sortedMembers[j].votes_with_party_pct && lastElement != sortedMembers[j]) {
                    mostLoyalMembers.push(sortedMembers[j]);
                }
            }

            this.mostLoyal = mostLoyalMembers;
            return this.mostLoyal;
        },
        getLeastEngagedMembers: function () {
            var leastEngagedMembers = [];
            var membersCopy = this.senators.slice(0);

            var sortedMembers = membersCopy.sort(function (a, b) {
                return b.missed_votes_pct - a.missed_votes_pct;
            });

            for (var i = 0; i < sortedMembers.length; i++) {
                var tenPercent = (sortedMembers.length) * 0.1;

                if (leastEngagedMembers.length <= tenPercent) {
                    leastEngagedMembers.push(sortedMembers[i]);
                }
            }

            var lastElement = leastEngagedMembers[leastEngagedMembers.length - 1];

            for (var j = sortedMembers.indexOf(lastElement); j < sortedMembers.length; j++) {
                if (lastElement.missed_votes_pct === sortedMembers[j].missed_votes_pct && lastElement != sortedMembers[j]) {
                    leastEngagedMembers.push(sortedMembers[j]);
                }
            }

            this.leastEngaged = leastEngagedMembers;
            return this.leastEngaged;
        },
        getMostEngagedMembers: function () {
            var mostEngagedMembers = [];
            var membersCopy = this.senators.slice(0);

            var sortedMembers = membersCopy.sort(function (a, b) {
                return a.missed_votes_pct - b.missed_votes_pct;
            });

            for (var i = 0; i < sortedMembers.length; i++) {
                var tenPercent = (sortedMembers.length) * 0.1;

                if (mostEngagedMembers.length <= tenPercent) {
                    mostEngagedMembers.push(sortedMembers[i]);
                }
            }

            var lastElement = mostEngagedMembers[mostEngagedMembers.length - 1];

            for (var j = sortedMembers.indexOf(lastElement); j < sortedMembers.length; j++) {
                if (lastElement.missed_votes_pct === sortedMembers[j].missed_votes_pct && lastElement != sortedMembers[j]) {
                    mostEngagedMembers.push(sortedMembers[j]);
                }
            }

            this.mostEngaged = mostEngagedMembers;
            return this.mostEngaged;
        }
    },
    created: function () {
        this.fetchData();
    },
    computed: {
        filterMembers: function () {
            return this.senators.filter(senator => {
                let partyFilterValue = this.selectedParties.length == 0 || this.selectedParties.includes(senator.party);
                let stateFilterValue = this.selectedState == 'All' || this.selectedState == senator.state;

                return partyFilterValue && stateFilterValue;
            })
        },
    }
})
