document.addEventListener("DOMContentLoaded",function(){
     const searchButton = document.getElementById("search-btn");
    const usernameInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");
    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");
    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");
    const cardStatsContainer = document.querySelector(".stats-cards");

    //
    function validateUsername(username) {
    username = username.trim();
    if (username === "") {
        alert("Username should not be empty");
        return false;
    }

    const regex = /^[a-zA-Z](?!.*[-_]{2})[a-zA-Z0-9_-]{0,13}[a-zA-Z0-9]$/;
    const isMatching = regex.test(username);
    
    if (!isMatching) {
        alert("Invalid Username");
    }

    return isMatching;
    }


    async function fetchUserDetails(username) {
        const url=`https://leetcode-stats-api.herokuapp.com/${username}`;
        searchButton.textContent="Searching....";
        searchButton.disabled=true;
        try{
            const response=await fetch(url);
            if(!response.ok){
                throw new Error("Unable to fetch user details");
            }
            const parsedData=await response.json();
            console.log("logging data:",parsedData);
           
            displayUserData(parsedData);
        }
        catch(error){
            statsContainer.innerHTML=`<p>No data found </p>`
        }
        finally{
            searchButton.textContent="Search";
            searchButton.disabled=false;
        }
        
    }

    function updateProgress(solved,total,label,circle){
        const progressDegree = (solved/total)*100;
        circle.style.setProperty("--progress-degree", `${progressDegree}%`);
        label.textContent = `${solved}/${total}`;
    }

    function displayUserData(parsedData){
        const totalQuestions = parsedData.totalQuestions;
        const totalSolved = parsedData.totalSolved;

        const totalEasyQuestions = parsedData.totalEasy;
        const totalMediumQuestions = parsedData.totalMedium;
        const totalHardQuestions = parsedData.totalHard;

        const easySolved = parsedData.easySolved;
        const mediumSolved = parsedData.mediumSolved;
        const hardSolved = parsedData.hardSolved;

        const acceptanceRate = parsedData.acceptanceRate;
        const contributionPoints = parsedData.contributionPoints;
        const ranking = parsedData.ranking;

        const submissionCalendar = parsedData.submissionCalendar;
        updateProgress(easySolved,totalEasyQuestions,easyLabel,easyProgressCircle);
        updateProgress(mediumSolved,totalMediumQuestions,mediumLabel,mediumProgressCircle);
        updateProgress(hardSolved,totalHardQuestions,hardLabel,hardProgressCircle);
        
        const cardsData = [
        { label: "Total Solved", value: `${parsedData.totalSolved} / ${parsedData.totalQuestions}` },
        { label: "Easy Solved", value: `${parsedData.easySolved} / ${parsedData.totalEasy}` },
        { label: "Medium Solved", value: `${parsedData.mediumSolved} / ${parsedData.totalMedium}` },
        { label: "Hard Solved", value: `${parsedData.hardSolved} / ${parsedData.totalHard}` },
        { label: "Acceptance Rate", value: `${parsedData.acceptanceRate}%` },
        { label: "Ranking", value: `#${parsedData.ranking}` },
        { label: "Contribution Points", value: parsedData.contributionPoints }
        ];


        cardStatsContainer.innerHTML = cardsData.map(card => `
        <div class="card">
            <h4>${card.label}</h4>
            <p>${card.value}</p>
        </div>
    `).join('');



    }

    searchButton.addEventListener('click',function(){
        const username =usernameInput.value;
        console.log("loggin username",username);
        if(validateUsername(username)){
            fetchUserDetails(username);
        }
    })
})