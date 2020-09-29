const requestTestWithFile =  (formData) => {
    fetch("/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(body),
    })
        .then((response) => {
            return response.text();
        })
        .then((result) => {
            $('#output').innerHTML = result;
            $('#btn-file-upload').text = 'Verify';
            $('#btn-file-upload').classList.remove('verifying-button');
        })
        .catch(() => {
            $('#btn-file-upload').text('Verify');
            $('#btn-file-upload').classList.remove('verifying-button');
            alert("try again!!!");
        });
}
const requestTestWithToken = (tokenName) => {
    fetch(`/${tokenName}`, {
        method: "POST",
    })
        .then((response) => {
            return response.text();
        })
        .then((result) => {
            $('#output').innerHTML = result;
            $('#btn-file-upload').text = 'Verify';
            $('#btn-file-upload').classList.remove('verifying-button');
        })
        .catch((e) => {
            console.log(e);
            $('#btn-file-upload').text('Verify');
            $('#btn-file-upload').classList.remove('verifying-button');
            alert("try again!!!");
        });
}

const inputValidation = () => {
    const fileName1 = $('#file1').value;
    const fileName2 = $('#file2').value;
    const fileName3 = $('#file3').value;
    try{
        if(!!!fileName1 && !!!fileName2 && !!!fileName3){
            const elUploadName = $$(".upload");
            const validation = [...elUploadName].find(el => el.value.slice(-1) == "%" && el.value.slice(0, 1) == "%")
            if(!!!validation) throw Error();
            return "request-example";
        }
        const extension1 = fileName1.split(".")[1].toLowerCase();
        const extension2 = fileName2.split(".")[1].toLowerCase();
        const extension3 = fileName3.split(".")[1].toLowerCase();

        let extension = "sol"
        if (extension1 != extension || extension2 != extension) {
            alert("File Extension must be .sol");
            console.log("???????????");
            return "error-extension";
        }
        extension = "js"
        if(extension3 != extension){
            alert("File Extension must be .js");
            console.log("!!!!!");
            return "error-extension";
        }
        console.log("................");
        return "request-file"
    }catch(e){
        alert("need Token, Target, initialize file to Validate!")
        return "error-input"
    }
}

const startInputValidation = () => {
    $('#btn-file-upload').addEventListener('click', () => {
        const [validate, type] = inputValidation().split("-");
        if(validate == "error") return;

        if(type == "file"){
            const form = $('#file-upload-form');
            const formData = new FormData(form);
            $('#btn-file-upload').textContent = 'Verifying...';
            $('#btn-file-upload').classList.add('verifying-button');
            requestTestWithFile(formData);
        }else if(type == "example"){
            const tokenName = $(".upload-name1").value.replaceAll("%", "");
            requestTestWithToken(tokenName);
        }
    });
}

const startInputChange = () => {
    const files = ['file1', 'file2', 'file3'];
    files.forEach((fileInput, index) => {
        const elFileInput = document.getElementById(fileInput)
        elFileInput.addEventListener("change", () => {
            const name = elFileInput.value;
            const elUploadFile = $(`.upload-name${index+1}`)
            elUploadFile.value = name;
        })
    });
}

const getLists = async () => {
    return fetch("/examples", {
        method: "GET",
    })
        .then((response) => {
            return response.json();
        })
        .then((exampleList) => {
            return exampleList;
        })
        .catch((err) => {
            alert("try again!!!");
        });
}
const getExampleHTML = (text) => {
    return `<section class="example-card">${text}</section>`;
}
const renderExamples = (examples) => {
    const exampleContent = $(".example-content");
    examples.forEach(example => {
        exampleContent.insertAdjacentHTML("beforeend", getExampleHTML(example));
    })
}
const closeExampleSidebar = () => {
    const exampleContainer = $(".example-container");
    exampleContainer.classList.add("hide");
    const exampleBackground = $(".example-background");
    setTimeout(() => {
        exampleBackground.classList.remove("display-flex");
    },500)
}
const startExampleBtn = () => {
    $(".example-btn").addEventListener("click", async () => {
        const exampleContainer = $(".example-container");
        const exampleContent = $(".example-content");
        if(!!!exampleContent.children.length){
            const examples = await getLists();
            await renderExamples(examples);
        }
        const exampleBackground = $(".example-background");
        exampleBackground.classList.add("display-flex");
        setTimeout(() => {
            exampleContainer.classList.remove("hide");
            exampleContainer.classList.add("reveal");
        },100)
    });
    $(".example-close-btn").addEventListener("click", closeExampleSidebar)
    $(".example-background").addEventListener("click", ({target}) => {
        if(!!!target.classList.contains("example-background")) return;
        closeExampleSidebar();
    })

}

const changeExampleLink = (tokenName) => {
    const [token, target, init] = [...$(".example-link")];
    const linkTemplate = "https://github.com/moonhyeonah/Erc20FunctionalVerifier/blob/master/top100tokens"
    token.innerHTML = `${tokenName}.sol`;
    token.href = `${linkTemplate}/${tokenName}/${tokenName}.sol`
    target.href = `${linkTemplate}/${tokenName}/Target.sol`
    init.href = `${linkTemplate}/${tokenName}/initialize.js`
}
const startChangeExample = () => {
    document.addEventListener("click", ({target}) => {
        if(!!!target.classList.contains("example-card")) return;
        changeExampleLink(target.innerHTML);
        closeExampleSidebar();
    })
}

const changeInputBox = () => {
    const files = ['file1', 'file2', 'file3'];
    const tokens = [...$$(".example-link")];
    files.forEach((fileInput, index) => {
        const elFileUpload = $(`.upload-name${index+1}`);
        elFileUpload.value = `%${tokens[index].innerHTML.split(".")[0]}%`;

        const elFileInput = $(`#file${index+1}`);
        elFileInput.value = "";
    });
}
const startApplyExample = () => {
    $(".apply-example-btn").addEventListener("click", changeInputBox);
}

startInputChange();
startInputValidation();
startExampleBtn();
startChangeExample();
startApplyExample();