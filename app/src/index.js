import Web3 from "web3";
import votingArtifact from "../../build/contracts/Voting.json";

let candidates = {"Rama": "totalVotes-1", "Nick": "totalVotes-2", "Jose": "totalVotes-3"};
//let roomNumber = 1;

var nowpage = localStorage.getItem("nowpage");


const App = {
 web3: null,
 account: null,
 voting: null,

 start: async function() {
  const { web3 } = this;

  try {
   // get contract instance
   const networkId = await web3.eth.net.getId();
   const deployedNetwork = votingArtifact.networks[networkId];

   this.voting = new web3.eth.Contract(
    votingArtifact.abi,
    deployedNetwork.address,
   );

   // get accounts
   const accounts = await web3.eth.getAccounts();
   this.account = accounts[0];

if (document.location.href.includes("vote1.html")){
   this.loadRoomData();
   this.firstloadCandidatesAndVotes();
}
if (document.location.href.includes("vote_list.html")){
   this.loadVoteList();
}

  } catch (error) {
   console.error("Could not connect to contract or chain.");
  }
  $("#voteIndex").val(nowpage);
 },
 
  createVoteRoom: async function() {
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getYear();
	var hour = today.getHours();
	var minute = today.getMinutes();
	var sec = today.getSeconds();
	if(dd<10) {
		dd='0'+dd
	} 

	if(mm<10) {
		mm='0'+mm
	}
	if(hour<10) {
		hour = '0'+hour;
	}
	if(minute<10){
		minute = '0'+minute;
	}
	if(sec<10){
		sec = '0'+sec;
	}
   let voteDate = (yyyy+"-"+mm+"-"+dd+","+hour+":"+minute+":"+sec).substring(1,20);
   //alert(voteDate);
   const { addVoteRoom, howManyRooms } = this.voting.methods;
   //$("#test1").html("State 1 : createVoteRoom start.");
   var candies = candiNum-1;
   var candidateList = new Array();
   for (var i = 0; i < candies; i++) {
     candidateList[i] = this.web3.utils.asciiToHex($("#candi"+(i+1)).val());
   }

   let max = $("#maxVote").val();
   let roomName = $("#title").val();
   roomName = this.web3.utils.asciiToHex(roomName);  
   voteDate = this.web3.utils.asciiToHex(voteDate);
   //var check = await addVoteRoom(roomName,candidateList,voteDate).call();
   var check = await addVoteRoom(roomName,candidateList,voteDate,max,0).send({gas: 320000, from: this.account});
  },
  
 loadRoomData: async function() {
   const { getRoomName, getVoteDate } = this.voting.methods;
   let number = nowpage;
   //alert("제목"+number);
   $("#loadRoomNum").val("");
   var roomName = await getRoomName(number,0,0).call();
   var voteDate = await getVoteDate(number,0,0).call();
 
   $("#roomName").html(this.web3.utils.hexToAscii(roomName));
   $("#voteDate").html(this.web3.utils.hexToAscii(voteDate));
   //alert("load Room 끝");
 },
 
 firstloadCandidatesAndVotes: async function() {
   
   const { getCandidateList, totalVotesFor } = this.voting.methods;
   let number = nowpage;
 
   var candidateList = await getCandidateList(number,0,0).call();
   
   for (var i = 1; i <= candidateList.length; i++) {
	 var add ='<tr><td id = "candidate-'+i+'"></td><td><input type="radio" name="pickme" value="'+i+'"></td><td id="totalVotes-'+i+'"></td></tr>';
	 $('#candiList > tbody:last').append(add);
     var name = this.web3.utils.hexToAscii(candidateList[i-1]);
     $("#candidate-" + i).html(name);
     var count = await totalVotesFor(number,candidateList[i-1],0).call();
     $("#totalVotes-" + i).html(count);
   }
   this.maxCheck()
 },

loadCandidatesAndVotes: async function() {
   
   const { getCandidateList, totalVotesFor } = this.voting.methods;
   let number = nowpage;
 
   
   var candidateList = await getCandidateList(number,0,0).call();
   
   for (var i = 1; i <= candidateList.length; i++) {
     var name = this.web3.utils.hexToAscii(candidateList[i-1]);
     $("#candidate-" + i).html(name);
     var count = await totalVotesFor(number,candidateList[i-1],0).call();
     $("#totalVotes-" + i).html(count);
   }
 },
 
 voteForCandidate: async function() {
  
  const { totalVotesFor, voteForCandidate, votedCheck } = this.voting.methods;
  //let temp = await votedCheck(nowpage,0,0,0).call();
  //alert(temp);
  var radioVal = $('input[name="pickme"]:checked').val();
  await voteForCandidate(nowpage,radioVal-1,0).send({gas: 600000, from: this.account});

  this.loadCandidatesAndVotes();
  this.maxCheck();
 },
 
 loadVoteList: async function() {
	 //alert("FAFSAS");
	 const {totalVotesFor, getCandidateList, maxCheck, isVoteEnd, getRoomName, getVoteDate, roomCount, howManyRooms } = this.voting.methods;
	 //alert("votes");
	 var votes = await howManyRooms(1).call();
	 //alert(votes);
	 $("#howManyVote").val(votes);
	 for (var i=1; i<=votes-1; i++){
		 //alert(i);
		var add = '<tr><th id = "num-'+i+'">'+i+'</th><th><a onclick = App.toVoting('+i+') id = "title-'+i+'" value='+i+'></a></th><th id = "date-'+i+'"></th></tr>';
		$('#votlist > tbody:last').append(add);
		var roomName = await getRoomName(i,0,0).call();
		roomName = this.web3.utils.hexToAscii(roomName);
		$("#title-" + i).html(roomName);
		
		var tmp = await maxCheck(i,0,0,0,0).call();
	 //alert(tmp);
	 var candidateList = await getCandidateList(i,0,0).call();
	 var sum = Number(0);
	 
     for (var j = 1; j <= candidateList.length; j++) {
     var count = await totalVotesFor(i,candidateList[j-1],0).call();
     sum += Number(count);
     }
	 //alert(sum);
	 if (tmp <= sum){
		 $("#title-" + i).append("(마감)");
	 }
		
		var tmp = await isVoteEnd(nowpage,0,0,0).call();
		//alert(i +" " +tmp);
		var voteDate = await getVoteDate(i,0,0).call();
		voteDate = this.web3.utils.hexToAscii(voteDate)
		$("#date-" + i).html(voteDate.substring(0,8)+'<br>'+voteDate.substring(9,20));
			//alert(roomName);
	 }
 },
 
 toVoting: async function(x){
	 let num = $("#title-"+x).attr('value');
	 //alert(num);
	 localStorage.setItem("nowpage", num);
	 location.href = "vote1.html";
 },
 
 maxCheck: async function(){
	 
	 const { voteEnd,getCandidateList, maxCheck,isVoteEnd,totalVotesFor } = this.voting.methods;
	 var tmp = await maxCheck(nowpage,0,0,0,0).call();
	 //alert(tmp);
	 var candidateList = await getCandidateList(nowpage,0,0).call();
	 var sum = Number(0);
     for (var i = 1; i <= candidateList.length; i++) {
     var count = await totalVotesFor(nowpage,candidateList[i-1],0).call();
     sum += Number(count);
     }
	 $("#left").html(tmp - sum);
	 if (tmp <= sum){
		 await voteEnd(nowpage,0,0,0);
		 //alert("??");
		 if(document.location.href.includes("vote1.html")){
			this.voteEnd();
		 }
	 }
     
 },
 
 voteEnd: async function(){
	//$("#candidate").html('투표가 마감되었습니다.'); 
	$("#candidate").replaceWith('<p>투표가 마감되었습니다.</p>');
 }
};

window.App = App;

window.addEventListener("load", function() {
 if (window.ethereum) {
  $("#" + candidates[name]).html("Ropsten");
  // use MetaMask's provider
  App.web3 = new Web3(window.ethereum);
  window.ethereum.enable(); // get permission to access accounts
 } else {
  $("#" + candidates[name]).html("Not working");
  console.warn(
   "No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live",
  );
  // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
  App.web3 = new Web3(
   new Web3.providers.HttpProvider("http://127.0.0.1:8545"),
  );
 }
 
 if (typeof web3 !== 'undefined') {
    // Mist/MetaMask의 프로바이더 사용
	if (document.location.href.includes("metamaskInfo.html")){
	location.href = "index.html";
	}
  } else {
    //alert("메타마스크가 설치되어 있지 않습니다. 안내 페이지로 이동합니다");
	
	if (!(document.location.href.includes("metamaskInfo.html"))){
	location.href = "metamaskInfo.html";
	}
  }
  
 App.start();
});