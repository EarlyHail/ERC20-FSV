$(document).ready(function(){
    $('#btn-file-upload').on('click', function() {
        const fileName1 = $('#file1').val().split(".")[1].toLowerCase();
        const fileName2 = $('#file2').val().split(".")[1].toLowerCase();
        const fileName3 = $('#file3').val().split(".")[1].toLowerCase();
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
        const form = $('#file-upload-form')[0];
        const formData = new FormData(form);

        $('#btn-file-upload').text('Verifying...');
        $('#btn-file-upload').addClass('verifying-button');
        $.ajax({
            type: 'POST',
            url: '/',
            data: formData,
            processData: false,
            contentType: false,
            success : function(data){
                $('#output').html(data);
                $('#btn-file-upload').text('Verify');
                $('#btn-file-upload').removeClass('verifying-button');
            },
            error : function(){
                alert("Communication Failure");
                $('#btn-file-upload').text('Verify');
                $('#btn-file-upload').removeClass('verifying-button');
            }
        });
    });
    const files = ['#file1', '#file2', '#file3'];
    $.each(files, function(index, fileClass) {
        $(fileClass).on('change', function () {
            const cur = $(fileClass).val();
            $(".upload-name"+fileClass.charAt(fileClass.length-1)).val(cur);
        });
    });
});
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
    const exampleContent = document.querySelector(".example-content");
    examples.forEach(example => {
        exampleContent.insertAdjacentHTML("beforeend", getExampleHTML(example));
    })
}
const closeExampleSidebar = () => {
    const exampleContainer = document.querySelector(".example-container");
    exampleContainer.classList.add("hide");
    const exampleBackground = document.querySelector(".example-background");
    setTimeout(() => {
        exampleBackground.classList.remove("display-flex");
    },500)
}
const startExampleBtn = () => {
    document.querySelector(".example-btn").addEventListener("click", async () => {
        const exampleContainer = document.querySelector(".example-container");
        const exampleContent = document.querySelector(".example-content");
        if(!!!exampleContent.children.length){
            const examples = await getLists();
            await renderExamples(examples);
        }
        const exampleBackground = document.querySelector(".example-background");
        exampleBackground.classList.add("display-flex");
        setTimeout(() => {
            exampleContainer.classList.remove("hide");
            exampleContainer.classList.add("reveal");
        },100)
    });
    document.querySelector(".example-close-btn").addEventListener("click", closeExampleSidebar)
    document.querySelector(".example-background").addEventListener("click", ({target}) => {
        if(!!!target.classList.contains("example-background")) return;
        closeExampleSidebar();
    })

}

const changeExampleLink = (tokenName) => {
    const [token, target, init] = [...document.querySelectorAll(".example-link")];
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

startExampleBtn();
startChangeExample();