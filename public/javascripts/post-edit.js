// find the post edit form
let postEditForm = document.getElementById('postEditForm');
// and submit listener post edit form
postEditForm.addEventListener('submit',(event)=>{
    // find the length of uploaded images
    let imageUploads = document.getElementById('imageUpload').files.length;
    // find the total no. of existing images
    let existingImgs = document.querySelectorAll('.imageDeleteCheckbox').length;
    //find the total no. of potential deletions
    let imageDeletions = document.querySelectorAll('.imageDeleteCheckbox:checked').length;
    // figure out if the form can be submitted or not
    let newTotal = existingImgs - imageDeletions+ imageUploads;
    if (newTotal > 4){
        // prevent form from submitting
        event.preventDefault();
        // calculate removal amount
        let removalAmt = newTotal - 4;
        // alert user of their error
        alert(`You need to remove at least ${removalAmt} (more) image${removalAmt === 1 ? '' : 's'}!`);
    }
});
