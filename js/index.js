$(function(){

    //var remote = require('remote'); // Load remote compnent that contains the dialog dependency
    //var dialog = remote.require('dialog'); // Load the dialogs component of the OS
    var fs = require('fs'); // Load the File System to execute our common tasks (CRUD)
    var fileContent = null;

    // Get all divs with "dropzone" class 
    var holders = document.getElementsByClassName('dropzone')

    // Prevent usual drag & drop functionality of Chrome 
    document.addEventListener('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
    });
    document.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.stopPropagation();
    });

    // Add drag & drop functionality to the "dropzone" divs 
    for (var index=0; index<holders.length; index++) {

        // Do nothing on dragover
        holders[index].ondragover = () => {
            return false;
        }

        // Do nothing on dragleave and on dragend
        holders[index].ondragleave = holders[index].ondragend = () => {
            return false;
        }

        // Read the file on drop
        holders[index].ondrop = (event) => {
            var id = event.currentTarget.id;     
            console.log(event);
            event.preventDefault();
            for (let file of event.dataTransfer.files) {
                console.log('File(s) you dragged here: ', file.path);
                readFile(file.path);

                // Make sure html and php tags are unusable by disabling < and >.
                fileContent = fileContent.replace(/\</gi, "");
                fileContent = fileContent.replace(/\/\>/gi, "");
                fileContent = fileContent.replace(/\>/gi, "");

                // Manipulate the fileContent
                fileContent = fileContent.replace(/\n/gi, "<br>");

                // Basic BBCodes.
                // fileContent = fileContent.replace(/\[b\]/gi, "<b>");
                // fileContent = fileContent.replace(/\[\/b\]/gi, "</b>");
                      
                // fileContent = fileContent.replace(/\[i\]/gi, "<i>");
                // fileContent = fileContent.replace(/\[\/i\]/gi, "</i>");
                      
                // fileContent = fileContent.replace(/\[u\]/gi, "<u>");
                // fileContent = fileContent.replace(/\[\/u\]/gi, "</u>");

                $("#"+id).html('<div id="'+id+'-contents">'+fileContent+'</div>');

                compareFiles();
            }
            return false;
        }


    }

    function readFile(filepath){
        fileContent = fs.readFileSync(filepath, 'utf-8');
    }

    // function readFile(filepath){
    //     fs.readFile(filepath, 'utf-8', function (err, data) {
    //         if(err){
    //             alert("An error ocurred reading the file :" + err.message);
    //         }
    //         else {
    //             // Change how to handle the file content
    //             console.log("The file content is : " + data);
    //             fileContent = data;
    //         }
    //     });
    // }

    function compareFiles() {
        var leftId = "dropzone-left";
        var rightId = "dropzone-right";

        var leftDiv = $('#'+leftId);
        var rightDiv = $('#'+rightId);

        var leftContents = leftDiv.contents();
        var rightContents = rightDiv.contents();

        if (leftContents.length != 0 && rightContents.length != 0) {

            var leftContentsArray = leftContents[0].innerHTML.split("<br>");
            var rightContentsArray = rightContents[0].innerHTML.split("<br>");

            $("#"+leftId).html("");
            $("#"+rightId).html("");


            var totalLength = (leftContentsArray.length < rightContentsArray.length ? rightContentsArray.length : leftContentsArray.length);
     
            for (var line=0; line<totalLength; line++) {

                var lines = {first: leftContentsArray[line], second: rightContentsArray[line]};
                compareLines(lines);

                $("#"+leftId).append(lines.first);
                $("#"+rightId).append(lines.second);
            }
        }
    }

    function compareLines(lines) {
        var leftWordsArray = lines.first.split(" ");
        var rightWordsArray = lines.second.split(" ");

        var totalLength = (leftWordsArray.length < rightWordsArray.length ? rightWordsArray.length : leftWordsArray.length);
 

        for (var word=0; word<totalLength; word++) {

            var words = {first: leftWordsArray[word], second: rightWordsArray[word]};
            compareStrings(words);

            leftWordsArray[word] = (words.first == '<span class="diff">undefined</span>' ? "" : words.first);
            rightWordsArray[word] = (words.second == '<span class="diff">undefined</span>' ? "" : words.second);
            
        }

        //
        var lineOne = "";
        leftWordsArray.forEach(function(element, index, array) {
            lineOne += element + " "; 
        })


        //
        var lineTwo = "";
        rightWordsArray.forEach(function(element, index, array) {
            lineTwo += element + " "; 
        })
        
        //
        lines.first = lineOne.substring(0, lineOne.length-1) + "<br>";
        lines.second = lineTwo.substring(0, lineTwo.length-1) + "<br>";
    }

    function compareStrings(strings) {
        var result = false;

        if (strings.first===strings.second) { 
            result.match=true; 
        }
        else { 
            result.match=false; 
            strings.first='<span class="diff">'+strings.first+'</span>'; 
            strings.second='<span class="diff">'+strings.second+'</span>';
        }
        return result;
    }

    // // Display some statistics about this computer, using node's os module.

    // var os = require('os');
    // var prettyBytes = require('pretty-bytes');

    // $('.stats').append('Number of cpu cores: <span>' + os.cpus().length + '</span>');
    // $('.stats').append('Free memory: <span>' + prettyBytes(os.freemem())+ '</span>');

    // // Electron's UI library. We will need it for later.

    // var shell = require('shell');


    // // Fetch the recent posts on Tutorialzine.

    // var ul = $('.flipster ul');

    // // The same-origin security policy doesn't apply to electron, so we can
    // // send ajax request to other sites. Let's fetch Tutorialzine's rss feed:

    // $.get('http://feeds.feedburner.com/Tutorialzine', function(response){

    //     var rss = $(response);

    //     // Find all articles in the RSS feed:

    //     rss.find('item').each(function(){
    //         var item = $(this);

    //         var content = item.find('encoded').html().split('</a></div>')[0]+'</a></div>';
    //         var urlRegex = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/g;

    //         // Fetch the first image of the article.
    //         var imageSource = content.match(urlRegex)[1];


    //         // Create a li item for every article, and append it to the unordered list.

    //         var li = $('<li><img /><a target="_blank"></a></li>');

    //         li.find('a')
    //             .attr('href', item.find('link').text())
    //             .text(item.find("title").text());

    //         li.find('img').attr('src', imageSource);

    //         li.appendTo(ul);

    //     });

    //     // Initialize the flipster plugin.

    //     $('.flipster').flipster({
    //         style: 'carousel'
    //     });

    //     // When an article is clicked, open the page in the system default browser.
    //     // Otherwise it would open it in the electron window which is not what we want.

    //     $('.flipster').on('click', 'a', function (e) {

    //         e.preventDefault();

    //         // Open URL with default browser.

    //         shell.openExternal(e.target.href);

    //     });

    // });

});