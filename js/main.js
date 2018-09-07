var skill = document.getElementById('skill');


var skills = ["development","security","UX"];
/* gimmicky?
*/
function changeSkills(i)
{
  skill.innerText=skills[i%skills.length]
  if(i>50){
      return;
  }
  setTimeout(

      function(){changeSkills((i+1));}, 1000);
}


