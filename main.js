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