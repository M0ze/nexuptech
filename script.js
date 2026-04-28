document.addEventListener('DOMContentLoaded', function() {
    console.log('The document has been loaded!');
    
    const heading = document.querySelector('h1');
    if (heading) {
        heading.addEventListener('click', function() {
            alert('You clicked the heading!');
        });
    }
});
