pragma solidity >=0.4.0 <0.6.0;
// This line says the code will compile with version greater than 0.4 and less than 0.6

contract Voting {
  // constructor to initialize candidates
  // vote for candidates
  // get count of votes for each candidates
  
  struct voteRoom {
    bytes32 roomName;
    bytes32[] candidateList;
    mapping (bytes32 => uint8) votesReceived;
	bytes32 voteDate;
    bool exists;
	mapping (address => uint8) voted;
	uint8 maxVotes;
	bool end;
  }

  mapping (uint8 => voteRoom) voteRoomList;
  uint8 public roomCount = 1;
  
  function isVoteEnd(uint8 roomNumber, uint8 xx, uint8 yy, uint8 zz) view public returns (bool) {
	 return voteRoomList[roomNumber].end;
  }
  
  function voteEnd(uint8 roomNumber, uint8 xx, uint8 yy, uint8 zz) public {
	 voteRoomList[roomNumber].end = true;
  }

  function maxCheck(uint8 roomNumber, uint8 xx, uint8 yy, uint8 zz, uint8 aa) view public returns (uint8) {
		return voteRoomList[roomNumber].maxVotes;
	}
  function votedCheck(uint8 roomNumber, uint8 xx, uint8 yy, uint8 zz) view public returns (bool) {
    if(voteRoomList[roomNumber].voted[msg.sender] == 1){
		return true;
	}
	else{
		return false;
	}
  }
  
  function addVoteRoom(bytes32 _roomName, bytes32[] memory _candidateList, bytes32 _voteDate, uint8 _max, uint8 xx) public {
        voteRoomList[roomCount].roomName = _roomName;
		voteRoomList[roomCount].candidateList = _candidateList;
        for (uint i = 0; i < _candidateList.length; i++) {
            voteRoomList[roomCount].votesReceived[_candidateList[i]] = 0;
        }
        voteRoomList[roomCount].voteDate = _voteDate;
        voteRoomList[roomCount].exists = true;
        voteRoomList[roomCount].maxVotes = _max;
		roomCount = roomCount + 1;
  }

  function getRoomName(uint8 roomNumber, uint8 xx, uint8 yy) view public returns(bytes32) {
	return voteRoomList[roomNumber].roomName;
  }

  function getCandidateList(uint8 roomNumber, uint8 xx, uint8 yy) view public returns(bytes32[] memory) {
	return voteRoomList[roomNumber].candidateList;
  }

  function getVoteDate(uint8 roomNumber, uint8 xx, uint8 yy) view public returns(bytes32) {
	return voteRoomList[roomNumber].voteDate;
  }

  function voteForCandidate(uint8 roomNumber, uint8 candiNum, uint8 xx) public {
	//require(!votedCheck(roomNumber,0,0,0));
    bytes32 candiName = voteRoomList[roomNumber].candidateList[candiNum];
	voteRoomList[roomNumber].votesReceived[candiName] += 1;
	voteRoomList[roomNumber].voted[msg.sender]=1;
  }

  function totalVotesFor(uint8 roomNumber, bytes32 candidate, uint8 xx) view public returns(uint8) {
    return voteRoomList[roomNumber].votesReceived[candidate];
  }
  
  function howManyRooms(uint8 xx) view public returns(uint8) {
	return roomCount;
  }
  
}