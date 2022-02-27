function requested_friends()
{
    let btn=document.getElementById("requested_button");
    btn.style.backgroundColor="pink";
    let btnacc=document.getElementById("accepted_button");
    btnacc.style.backgroundColor="var(--color-light)";
}

function accepted_friends()
{
    let btn=document.getElementById("accepted_button");
    btn.style.backgroundColor="pink";
    let btnacc= document.getElementById("requested_button");
    btnacc.style.backgroundColor="var(--color-light)";
}    

function dropdownM1Function() {
    document.getElementById("Month1").classList.toggle("show");
}

function dropdownM2Function() {
    document.getElementById("Month2").classList.toggle("show");
}

function dropdownCatFunction() {
    document.getElementById("Category").classList.toggle("show");
}

window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
}
