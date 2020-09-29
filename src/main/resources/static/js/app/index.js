const requestTest =  (formData) => {
    fetch("/", {
        method: "POST",
        body: formData,
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

const startInputValidation = () => {
    $('#btn-file-upload').addEventListener('click', () => {
        const fileName1 = $('#file1').value.split(".")[1].toLowerCase();
        const fileName2 = $('#file2').value.split(".")[1].toLowerCase();
        const fileName3 = $('#file3').value.split(".")[1].toLowerCase();
        let extension = "sol"
        if (fileName1 != extension || fileName2 != extension) {
            alert("File Extension must be .sol");
            return;
        }
        extension = "js"
        if(fileName3 != extension){
            alert("File Extension must be .js");
            return;
        }
        const form = $('#file-upload-form');
        const formData = new FormData(form);
        $('#btn-file-upload').textContent = 'Verifying...';
        $('#btn-file-upload').classList.add('verifying-button');
        requestTest(formData);
    });
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

startInputValidation();
startExampleBtn();
startChangeExample();
