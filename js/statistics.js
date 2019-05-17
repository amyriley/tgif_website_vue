statistics = {
    "most_loyal": [],
    "least_loyal": [],
    "least_engaged": [],
    "most_engaged": [],
    "parties": [
        {
            "title": "Democrats",
            "total_reps": 0,
            "votes_percentage": 0
            },
        {
            "title": "Republicans",
            "total_reps": 0,
            "votes_percentage": 0
            },
        {
            "title": "Independents",
            "total_reps": 0,
            "votes_percentage": 0
            },
        {
            "title": "Total",
            "total_reps": 0,
            "votes_percentage": 0
            }
        ],
}

function getPartyMemberList(politicalData, partyIndicator) {

    var memberList = [];

    for (i = 0; i < politicalData.results[0].members.length; i++) {
        if (politicalData.results[0].members[i].party.includes(partyIndicator)) {
            memberList.push(politicalData.results[0].members[i]);
        }
    }

    return memberList;
}

function getAveragePercentPartyVotes(politicalData, partyIndicator) {

    var totalMembersList = getPartyMemberList(politicalData, partyIndicator);
    var totalPercentage = 0;
    
    for (i = 0; i < politicalData.results[0].members.length; i++) {
        
        if (politicalData.results[0].members[i].party.includes(partyIndicator)) {
            var percentage = politicalData.results[0].members[i].votes_with_party_pct;
            totalPercentage = totalPercentage + percentage;
        }
    }

    var averagePercentage = totalPercentage / totalMembersList.length;
    
    if (isNaN(averagePercentage)) {
        averagePercentage = 0;
    }
    
    return averagePercentage;
}

function findLeastLoyalMembersAllParties(politicalData) {

    var leastLoyalMembers = [];
    var membersCopy = politicalData.results[0].members.slice(0);

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

    statistics.least_loyal = leastLoyalMembers;
}

function findMostLoyalMembersAllParties(politicalData) {

    var mostLoyalMembers = [];
    var membersCopy = politicalData.results[0].members.slice(0);

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

    statistics.most_loyal = mostLoyalMembers;
}

function findLeastEngagedMembersAllParties(politicalData) {

    var leastEngagedMembers = [];
    var membersCopy = politicalData.results[0].members.slice(0);

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
    
    statistics.least_engaged = leastEngagedMembers;
}

function findMostEngagedMembersAllParties(politicalData) {

    var mostEngagedMembers = [];
    var membersCopy = politicalData.results[0].members.slice(0);

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

    statistics.most_engaged = mostEngagedMembers;
}

// tables:

function createTableHeader(tableHeaderTitles, table) {

    var headerRow = document.createElement('thead');

    var newRow = headerRow.insertRow(-1);

    //    var headerRow = document.createElement('tr');

    tableHeaderTitles.forEach(function (header) {
        var newTitle = document.createElement('th');
        newTitle.innerHTML = header;
        newRow.appendChild(newTitle);
    });

    table.appendChild(headerRow);
}

function atAGlanceTable(storedData) {

    var table = document.getElementById('at_a_glance');
    var tableHeaderTitles = ['Party', 'No. of Reps', '% Voted /w Party'];

    var tableBody = document.createElement('tbody');

    createTableHeader(tableHeaderTitles, table);

    var values = Object.values(statistics.parties);

    for (var i = 0; i < values.length; i++) {
        var row = document.createElement('tr');

        var titleCell = document.createElement('td');
        titleCell.innerHTML = values[i].title;
        row.appendChild(titleCell);

        var repsCell = document.createElement('td');
        repsCell.innerHTML = values[i].total_reps;
        row.appendChild(repsCell);

        var percentageCell = document.createElement('td');
        percentageCell.innerHTML = values[i].votes_percentage || "";
        row.appendChild(percentageCell);

        tableBody.appendChild(row);
    }

    table.appendChild(tableBody);
}

function leastEngagedTable(storedData) {

    var table = document.getElementById('least_engaged_table');
    var tableHeaderTitles = ['Name', 'No. of Missed Votes', '% Missed'];

    var tableBody = document.createElement('tbody');

    createTableHeader(tableHeaderTitles, table);

    var values = Object.values(statistics.least_engaged);

    for (var i = 0; i < values.length; i++) {
        var row = document.createElement('tr');

        var nameCell = document.createElement('td');
        nameCell.innerHTML = values[i].first_name + ' ' + (values[i].middle_name || "") + ' ' + values[i].last_name;
        row.appendChild(nameCell);

        var numberMissedVotes = document.createElement('td');
        numberMissedVotes.innerHTML = values[i].missed_votes;
        row.appendChild(numberMissedVotes);

        var missedPercentageCell = document.createElement('td');
        missedPercentageCell.innerHTML = values[i].missed_votes_pct;
        row.appendChild(missedPercentageCell);

        tableBody.appendChild(row);
    }

    table.appendChild(tableBody);
}

function mostEngagedTable(storedData) {

    var table = document.getElementById('most_engaged_table');
    var tableHeaderTitles = ['Name', 'No. of Missed Votes', '% Missed'];

    var tableBody = document.createElement('tbody');

    createTableHeader(tableHeaderTitles, table);

    var values = Object.values(statistics.most_engaged);

    for (var i = 0; i < values.length; i++) {
        var row = document.createElement('tr');

        var nameCell = document.createElement('td');
        nameCell.innerHTML = values[i].first_name + ' ' + (values[i].middle_name || "") + ' ' + values[i].last_name;
        row.appendChild(nameCell);

        var numberMissedVotes = document.createElement('td');
        numberMissedVotes.innerHTML = values[i].missed_votes;
        row.appendChild(numberMissedVotes);

        var missedPercentageCell = document.createElement('td');
        missedPercentageCell.innerHTML = values[i].missed_votes_pct;
        row.appendChild(missedPercentageCell);

        tableBody.appendChild(row);
    }

    table.appendChild(tableBody);
}

function leastLoyalTable(storedData) {

    var table = document.getElementById('least_loyal_table');
    var tableHeaderTitles = ['Name', 'No. Party Votes', '% Party Votes'];

    var tableBody = document.createElement('tbody');

    createTableHeader(tableHeaderTitles, table);

    var values = Object.values(statistics.least_loyal);
    console.log(values);

    for (var i = 0; i < values.length; i++) {
        var row = document.createElement('tr');

        var nameCell = document.createElement('td');
        nameCell.innerHTML = values[i].first_name + ' ' + (values[i].middle_name || "") + ' ' + values[i].last_name;
        row.appendChild(nameCell);

        var numberPartyVotes = document.createElement('td');
        numberPartyVotes.innerHTML = values[i].total_votes;
        row.appendChild(numberPartyVotes);

        var percentagePartyVotesCell = document.createElement('td');
        percentagePartyVotesCell.innerHTML = values[i].votes_with_party_pct;
        row.appendChild(percentagePartyVotesCell);

        tableBody.appendChild(row);
    }

    table.appendChild(tableBody);
}

function mostLoyalTable(storedData) {

    var table = document.getElementById('most_loyal_table');
    var tableHeaderTitles = ['Name', 'No. Party Votes', '% Party Votes'];

    var tableBody = document.createElement('tbody');

    createTableHeader(tableHeaderTitles, table);

    var values = Object.values(statistics.most_loyal);

    for (var i = 0; i < values.length; i++) {
        var row = document.createElement('tr');

        var nameCell = document.createElement('td');
        nameCell.innerHTML = values[i].first_name + ' ' + (values[i].middle_name || "") + ' ' + values[i].last_name;
        row.appendChild(nameCell);

        var numberPartyVotes = document.createElement('td');
        numberPartyVotes.innerHTML = values[i].total_votes;
        row.appendChild(numberPartyVotes);

        var percentagePartyVotesCell = document.createElement('td');
        percentagePartyVotesCell.innerHTML = values[i].votes_with_party_pct;
        row.appendChild(percentagePartyVotesCell);

        tableBody.appendChild(row);
    }

    table.appendChild(tableBody);
}

function calculateStatistics(storedData) {
    var allDemocrats = getPartyMemberList(storedData, "D");
    statistics.parties[0].total_reps = allDemocrats.length;

    var allRepublicans = getPartyMemberList(storedData, "R");
    statistics.parties[1].total_reps = allRepublicans.length;

    var allIndependents = getPartyMemberList(storedData, "I");
    statistics.parties[2].total_reps = allIndependents.length;

    statistics.parties[3].total_reps = storedData.results[0].members.length;

    var percentageDemocrats = getAveragePercentPartyVotes(storedData, "D");
    statistics.parties[0].votes_percentage = parseFloat(Math.round(percentageDemocrats * 100) / 100).toFixed(2);

    var percentageRepublicans = getAveragePercentPartyVotes(storedData, "R");
    statistics.parties[1].votes_percentage = parseFloat(Math.round(percentageRepublicans * 100) / 100).toFixed(2);

    var percentageIndependents = getAveragePercentPartyVotes(storedData, "I");
    statistics.parties[2].votes_percentage = parseFloat(Math.round(percentageIndependents * 100) / 100).toFixed(2);

    var averagePercentage = (percentageDemocrats + percentageRepublicans + percentageIndependents) / 3;
    statistics.parties[3].votes_percentage = parseFloat(Math.round(averagePercentage * 100) / 100).toFixed(2);
    
    findLeastEngagedMembersAllParties(storedData);
    findMostEngagedMembersAllParties(storedData);
    findLeastLoyalMembersAllParties(storedData);
    findMostLoyalMembersAllParties(storedData);
}


























