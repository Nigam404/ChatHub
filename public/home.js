const Token = localStorage.getItem("ChatToken");

//CREATE ELEMENT FUNCTION(MESSAGE)..........................................................
function createMsgElement(obj) {
  let parent = document.getElementById("content");
  let child = document.createElement("p");
  child.innerText = obj.username + " : " + obj.message;
  parent.appendChild(child);
}

//CREATE GROUP ELEMENT......................................................................
async function createGroup(group) {
  //creating group element
  let parentUL = document.getElementById("groups");
  let list = document.createElement("li");
  let btn = document.createElement("button");
  btn.innerText = group.name;
  list.appendChild(btn);
  parentUL.appendChild(list);

  //group name button click method.
  btn.onclick = async () => {
    // alert("Welcome to group : " + group.name);

    //putting group header
    const groupHeader = document.getElementById("group-header");
    groupHeader.innerText = "";
    groupHeader.innerText = "Group-" + group.name;

    //getting members added in the group
    const members = await axios.get(
      `http://localhost:3000/group/getmembers/${group.id}`
    );

    //making hidden thing(send message and member feature) visible
    const member_div = document.getElementById("members");
    member_div.style.visibility = "visible";
    document.getElementById("footer").style.visibility = "visible";

    //checking the user is admin of this group or not
    const adminuser = await axios.get(
      `http://localhost:3000/group/isadmin/${group.id}`,
      {
        headers: { Authorization: Token },
      }
    );

    //showing add member button and select area if the user is admin else hiding it.
    if (adminuser.data.admin == true) {
      document.getElementById("member").style.visibility = "visible"; //select area
      document.getElementById("addmember").style.visibility = "visible"; //add btn
    } else {
      document.getElementById("member").style.visibility = "hidden"; //select area
      document.getElementById("addmember").style.visibility = "hidden"; //add btn
    }

    //resetting member section
    const added_member = document.getElementById("addedmember");
    added_member.innerText = "";

    //if no member found in group
    if (members.data.length == 0) {
      added_member.innerText = "No member joined yet...";
    }
    //if any member found in group
    else {
      let UL = document.createElement("ul");
      members.data.forEach(async (mem) => {
        //checking if this member is an admin or not
        const ismemberadmin = await axios.get(
          `http://localhost:3000/group/ismemberadmin/${mem.id}/${group.id}`
        );
        let list = document.createElement("li");
        //showing admin next to the member name if this member is admin
        if (ismemberadmin.data.admin == true) {
          list.innerText = mem.name + "-Admin";
        } else {
          list.innerText = mem.name;
        }
        list.style.color = "#00FF00";

        //creating addadmin and remove user button if user is admin
        if (adminuser.data.admin == true) {
          //creating make admin button if this member is not admin
          if (ismemberadmin.data.admin != true) {
            let adminbtn = document.createElement("button");
            adminbtn.innerText = "+";
            adminbtn.title = "Add as admin";
            adminbtn.style.color = "#00FF00";
            adminbtn.onclick = async () => {
              await axios.get(
                `http://localhost:3000/group/make-admin/${mem.id}/${group.id}`
              );
              alert(mem.name + " added as admin !");
            };
            list.appendChild(adminbtn);
          }

          //creating remove user button
          let removebtn = document.createElement("button");
          removebtn.innerText = "-";
          removebtn.title = "Remove user from group";
          removebtn.style.color = "red";
          removebtn.onclick = async () => {
            await axios.get(
              `http://localhost:3000/group/remove-user/${mem.id}/${group.id}`
            );
            UL.removeChild(list); //removing list from UI.
            alert("User removed from group!");
          };
          list.appendChild(removebtn);
        }

        UL.appendChild(list);
      });
      added_member.appendChild(UL);
    }

    //getting all member and putting in select area
    const users = await axios.get("http://localhost:3000/user/getalluser");
    const selectArea = document.getElementById("member");
    selectArea.innerText = ""; //resetting field

    users.data.forEach((user) => {
      let option = document.createElement("option");
      option.value = user.id;
      option.innerText = user.name;
      selectArea.appendChild(option);
    });

    //add-member button click
    document.getElementById("addmember").onclick = async () => {
      let obj = {
        memberid: document.getElementById("member").value,
      };
      await axios.post(
        `http://localhost:3000/group/addmember/${group.id}`,
        obj
      );
      alert("user added to group!");
    };

    //send msg button click event
    document.getElementById("sendmsg").onclick = async () => {
      let obj = {
        message: document.getElementById("msg").value,
      };
      const msg = await axios.post(
        `http://localhost:3000/message/save/${group.id}`,
        obj,
        {
          headers: { Authorization: Token },
        }
      );
      createMsgElement(msg.data);
    };

    //fetching all messages in the group
    const messages = await axios.get(
      `http://localhost:3000/message/getmsg/${group.id}`
    );
    //resetting message div
    document.getElementById("content").innerText = "";
    //creating UI element for message
    messages.data.forEach((element) => {
      createMsgElement(element);
    });
    // setInterval(async () => {}, 20000);
  };
}

//CREATE GROUP BUTTON CLICK................................................................
document.getElementById("creategroup").onclick = async () => {
  const groupname = prompt("Enter Group Name:");
  let obj = {
    name: groupname,
  };
  const group = await axios.post("http://localhost:3000/group/create", obj, {
    headers: { Authorization: Token },
  });
  //creating group on UI
  createGroup(group.data);
};

//DOM RELOAD FUNCTION.......................................................................
document.addEventListener("DOMContentLoaded", async () => {
  //putting username on screen
  const CurrUser = await axios.get(
    "http://localhost:3000/user/get-current-user",
    { headers: { Authorization: Token } }
  );
  document.getElementById("heading").innerText =
    "* Welcome " + CurrUser.data.name + " *";

  //fetching all groups for current user
  const groups = await axios.get("http://localhost:3000/group/getgroup", {
    headers: { Authorization: Token },
  });

  //calling create group element function
  groups.data.forEach((element) => {
    createGroup(element);
  });

  //putting hint message on screen
  let heading = document.getElementById("group-header");
  heading.innerText = "Open any Group to start messaging...";
});
