nSessions = 8;
    studentGrid = document.getElementById("studentTags");
    // studentGrid.style.gridTemplateColumns = `repeat(${nSessions}, 1fr)`;
    students = ["Danny", "Aiden", "Millie"];
    studentTagList = {};


    sessions = ["Monday-AM", "Tuesday-AM", "Wednesday-AM", "Thursday-AM", "Monday-PM", "Tuesday-PM", "Wednesday-PM", "Thursday-PM"];
    interimOptions = ["Cooking", "Makerspace", "Robotics", "Coding", "Other"];
    interimSessionDB = {};



    studentRow = 0;
    studentSelect = document.getElementById("studentSelect");


    for (let student of students){
        createStudentTags(student);
    }

    let studentTags = document.getElementById("studentTags");
    function createStudentTags(student){
        studentTagList[student] = [];
        studentRow += 1;

        for (let i=0; i<nSessions; i++){
            let div = document.createElement("div");
            div.id = student + "_" + (i+1);
            div.classList.add("studentTag");
            div.innerHTML = student;
            div.draggable = true;
            // div.style.gridRow = studentRow;
            div.style.gridColumn = i+1;

            // create student sytle class
            let styleName = `${student}_style`;
            styleDiv = document.getElementById("studentStyles");
            styleDiv.sheet.insertRule(`
                .${styleName} {
                    background-color: yellow;
                }
            `);
            div.classList.add(styleName);

            
            // 
            // studentTags.appendChild(div);
            let studentTagObj = {
                div: div,
                location_id: "studentTags",
                row: i+1
            }

            studentTagList[student].push(studentTagObj);
        }

        let opt = document.createElement("option");
        opt.value = student;
        opt.textContent = student;
        studentSelect.appendChild(opt);

    }

    studentSelect.addEventListener("change", function(){
        console.log(this.value);
        studentTags.innerHTML = "";
        for (let tag of studentTagList[this.value]){
            
            if (tag["location_id"] === "studentTags"){
                // console.log(tag["div"].id);
                studentTags.append(tag["div"]);
            }
        }
        setActiveBackgroundColor(this.value);
        
    })


    // INTERIM OPTIONS    
    for (let iName of interimOptions){
        insertInterimOptions(iName);
    }
    console.log("interimSessionDB", interimSessionDB);

    function insertInterimOptions(interimOption){
        let div = document.createElement("div");
        div.id = interimOption;

        let titleDiv = document.createElement("div");
        titleDiv.innerHTML = `<h2>${interimOption}</h2>`;
        div.appendChild(titleDiv);

        let calendarGrid = document.createElement("div");
        calendarGrid.id = "calendar_" + interimOption;
        calendarGrid.classList.add("calendarGrid");

        interimSessionDB[interimOption] = {};

        for (let sName of sessions) {
            insertSessionDiv(sName, interimOption, calendarGrid);
            interimSessionDB[interimOption][sName] = [];
        }

        div.appendChild(calendarGrid);

        let interimOptions = document.getElementById("interimOptions");
        interimOptions.appendChild(div);
    }

    function insertSessionDiv(sessionName, interimOption, calendarGrid){
        let div = document.createElement("div");
        //div.id = "session" + "_" + interimOption + "_" + sessionName;
        div.classList.add("interimSessionBlock");

        let titleDiv = document.createElement("div");
        titleDiv.innerHTML = sessionName;
        titleDiv.style.fontWeight = "bold";
        // titleDiv.gridColumn = '1 / -1';
        div.appendChild(titleDiv);

        // student list div
        let stuDiv = document.createElement('div');
        stuDiv.id = "session" + "_" + interimOption + "_" + sessionName;
        stuDiv.classList.add("interimSession");

        div.appendChild(stuDiv);

        calendarGrid.appendChild(div);
    }



    document.addEventListener("dragstart", function(ev){
        // Add the target element's id to the data transfer object
        ev.dataTransfer.setData("application/my-app", ev.target.id);
        ev.dataTransfer.effectAllowed = "move";
        let student = ev.target.id.split("_")[0];
        
        // setClassBackgroundColor(student, 'tomato');
    })

    document.addEventListener("drop", function (ev) {
        ev.preventDefault();

        targetData = ev.target.id.split("_");

        if ( ev.target.id === "studentTags"){
            // Get the id of the target and add the moved element to the target's DOM
            const tagID = ev.dataTransfer.getData("application/my-app");

            ev.target.appendChild(document.getElementById(tagID));

            let info = tagID.split("_");
            let student = info[0];
            console.log("Drop: ", student, tagID, ev.target.id);


            //setClassBackgroundColor(student, 'yellow');
            

            //remove from interimSessionDB
            for (let iOpt of interimOptions){
                for (let session of sessions){
                    let index = interimSessionDB[iOpt][session].indexOf(tagID);
                    if (index !== -1){
                        interimSessionDB[iOpt][session].splice(index, 1);
                    }
                }
            }

            //change location in student tag list
            for (let i = 0; i < nSessions; i++) {
                if (studentTagList[student][i]['div'].id === tagID) {
                    studentTagList[student][i]['location_id'] = "studentTags";
                }
                // console.log(studentTagList[student][i] )
            }

        }

        if (targetData[0] === 'session'){
            // Get the id of the target and add the moved element to the target's DOM
            const tagID = ev.dataTransfer.getData("application/my-app");

            ev.target.appendChild(document.getElementById(tagID));

            let info = tagID.split("_");
            let student = info[0];
            console.log("Drop: ", student, tagID, ev.target.id);
            //setClassBackgroundColor(student, 'yellow');
            
            
            //add to interimSessionDB
            let interimOpt = targetData[1];
            let sessionTime = targetData[2];

            console.log("interimOpt:", interimOpt)
            console.log("sessionTime", sessionTime)
            interimSessionDB[interimOpt][sessionTime].push(tagID);
            console.log(interimSessionDB)

            for (let i = 0; i < nSessions; i++) {
                if (studentTagList[student][i]['div'].id === tagID) {
                    studentTagList[student][i]['location_id'] = ev.target.id;
                }
                // console.log(studentTagList[student][i] )
            }
        }
        

    })

    document.addEventListener("dragover", function (ev) {
        ev.preventDefault();
        ev.dataTransfer.dropEffect = "move";
    })

    function setActiveBackgroundColor(student){
        console.log("Changing style for: ", student);
        let className = student + "_" + "style";
        for (let rule of document.getElementById("studentStyles").sheet.cssRules) {
            if (rule.selectorText === `.${className}`) {
                rule.style.backgroundColor = "yellow";
                rule.style.padding = "12px";
            } 
            else {
                rule.style.backgroundColor = "tomato";
                rule.style.padding = '2px';
            }
        }
    }
 