$(document).ready(function() {

    $(".scrape-articles").on("click", function(event) {
        event.preventDefault();
        $.get("/scrape", function(data) {
            location.reload();
        })
    });

    $(".clear-articles").on("click", function(event) {
        event.preventDefault();
        
    })

   ////////index.html
    $.get("/api/articles/0", function(data) {
        console.log(data);

        data.forEach(element => {
            let newDiv = $("<div>").addClass("card");
            let cardBody = $("<div>").addClass("card-body");
            let rowDiv = $("<div>").addClass("row");
            let col1 = $("<div>").addClass("col-md-4");
            let col2 = $("<div>").addClass("col-md-8");
            let titleTag = $("<h5>").addClass("card-title").text(element.title);
            let linkTag = $("<a>").attr("href", element.link);
            let authorTag = $("<p>").text(element.author);
            let imgTag = $("<img>").attr("src", element.image).addClass("article-img");
            let sumTag = $("<p>").text(element.summary);
            let btnTag = $("<button>").addClass("btn save-article").attr("data-id", element._id).text("Save Article");

            linkTag.append(titleTag);
            col1.append(imgTag);
            col2.append(linkTag, sumTag, authorTag, btnTag);
            rowDiv.append(col1, col2);
            cardBody.append(rowDiv);
            newDiv.append(cardBody);
            $("#article-disp").append(newDiv);
        });
    });

    $(document).on("click", ".save-article", function(event) {
        event.preventDefault();
        var id = $(this).attr("data-id");
        console.log(id);

        $.ajax(`/article/${id}/1`, {type: "PUT"})
        .then(function(data) {
            console.log("return")
            location.reload();
        })
    })


    ///////saved.html
    $.get("/api/articles/1", function(data) {
        console.log(data);

        data.forEach(element => {
            let newDiv = $("<div>").addClass("card");
            let cardBody = $("<div>").addClass("card-body");
            let rowDiv = $("<div>").addClass("row");
            let col1 = $("<div>").addClass("col-md-4");
            let col2 = $("<div>").addClass("col-md-8");
            let titleTag = $("<h5>").addClass("card-title").text(element.title);
            let linkTag = $("<a>").attr("href", element.link);
            let authorTag = $("<p>").text(element.author);
            let imgTag = $("<img>").attr("src", element.image).addClass("article-img");
            let sumTag = $("<p>").text(element.summary);
            let btnTag1 = $("<button>").addClass("btn remove-article").attr("data-id", element._id).text("Remove Article");
            let btnTag2 = $("<button>").addClass("btn notes").attr("data-id", element._id)
                        .attr("data-toggle", "modal").attr("data-target", "#exampleModal").text("Notes");
           
            linkTag.append(titleTag);
            col1.append(imgTag);
            col2.append(linkTag, sumTag, authorTag, btnTag1, btnTag2);
            rowDiv.append(col1, col2);
            cardBody.append(rowDiv);
            newDiv.append(cardBody);
            $("#saved-disp").append(newDiv);
        });
    });

    $(document).on("click", ".remove-article", function(event) {
        event.preventDefault();
        var id = $(this).attr("data-id");
        console.log(id);

        $.ajax(`/article/${id}/0`, {type: "PUT"})
        .then(function(data) {
            location.reload();
        })
    });

    $(document).on("click", ".notes", function(event) {
        event.preventDefault();
        var id = $(this).attr("data-id");
        $(".modal-title").text(`Notes for article: ${id}`);

        $.get(`/api/notes/${id}`, function(data) {
            console.log(data);
        })

    });

    $(document).on("click", ".save-note", function(event) {
        event.preventDefault();
        var t = $(".modal-title").text();
        var id = t.split(" ")[3];
        var text = $("#inputNote").val().trim();
        
        var obj = {
            id,
            text
        };
        console.log(obj);

        $.post("/notes", obj, function(data) {
            location.reload();
        })

    })

})