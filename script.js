function display_values() //to set the array containing the values
{
    refresh_all(); 
    window.myvar; //making myvar a global variable
    myvar = document.getElementById("value_input").value;
    myvar =myvar.split(" ");
    var i;
    for(i=0; i<myvar.length; i++)
    {
        myvar[i]=parseInt(myvar[i]);
        if(myvar[i]>=0 && myvar[i]<=9) //checking for numeric
            continue;
        else
        {
            document.getElementById("value_input").value=""; //resetting the input field for wrong input
            alert("Possible errors : \n 1) Please enter only numeric values. \n 2) Do not enter a space at the end!");
        }
    }
}

function refresh_all () //resetting everything for the new input
{
    document.getElementById("hits").innerText="0/10";
    document.getElementById("miss").innerText="0/10";
    for(i=1; i<=40; i++)
        document.getElementById("b"+i).innerText='-';
    for(i=1; i<=10; i++)
        document.getElementById("h"+i).style.backgroundColor="white";
    document.getElementById("lru").style.backgroundColor="white";
    document.getElementById("fifo").style.backgroundColor="white";
    document.getElementById("optimal").style.backgroundColor="white";
}

function copy_initial_values(k) //copying those values to the next step which are already placed 
{
    var i, x;
    for(i=1; i<=4; i++)
    {
        x=document.getElementById("b" + (4*(k-1)+i)).innerText;
        if(x!='-')
            document.getElementById("b" + (4*k +i)).innerText= parseInt(x);
        else
            break;
    }
}

function update_ratio(k) //updating hit and miss ratios
{
    var s, r;
    if(k==1) //hit
    {
        s=document.getElementById("hits").innerText;
        r= (parseInt(s[0])+1)+"/" +"10";
        document.getElementById("hits").innerText=r;
    }
    else //miss
    {
        s=document.getElementById("miss").innerText;
        r= (parseInt(s[0])+1)+"/" +"10";
        document.getElementById("miss").innerText=r;
    }
}

function color_hits_and_misses(a, given) //to update hit/miss status
{
    if(a==0) //miss
        document.getElementById(given).style.background="red";
    else //hit
        document.getElementById(given).style.background="green";
}

function check_for_present(queue, ele) //checking whether an entry is already present
{
    var i, x;
    for(i=0; i<4; i++)
    {
        if(queue[i]==ele)
            return 1;
    }
    return 0;
}

function fifo() 
{
    refresh_all();
    document.getElementById("fifo").style.backgroundColor="#009f9f"; 
    var i, j, r=0,k;
    var queue = []; //to store entry sequence, to decide which to eliminate
    (function theLoop (i) {
        setTimeout(function () {
            if(i!=0) //copying values except for the 1st one
            copy_initial_values(i);
       if(document.getElementById("b"+(4*i+4)).innerText=='-' && i<4) //insert directly, applicable only for 1st 4
       {    
          // alert("b"+(4*i+r)); 
          color_hits_and_misses(0,"h" + (i+1) );     
           document.getElementById("b" + (4*i+r+1)).innerText=myvar[i];
           r=r+1; 
           queue.push(myvar[i]);
           update_ratio(0);          
       }
       else if (check_for_present(queue, myvar[i])==1) //gives a hit
       {
            color_hits_and_misses(1,"h" + (i+1));
            update_ratio(1);
       }
       else //using fifo
       {
            j=queue.shift() //popping the element
            for(k=1; k<=4; k++)
            {
                if(parseInt(document.getElementById("b" + (4*(i-1)+k)).innerText) == j)
                {
                    document.getElementById("b" + (4*i+k)).innerText = myvar[i]; //updating the new value
                    color_hits_and_misses(0, "h"+(i+1));
                    update_ratio(0);
                    queue.push(myvar[i]); //pushing the new value in the queue
                }
            }
       }
          if (++i < myvar.length) {          // If i > 0, keep going
            theLoop(i);       // Call the loop again, and pass it the current value of i
          }
        }, 1500);
      })(0);

}

function lru()
{
    refresh_all();
    document.getElementById("lru").style.backgroundColor="#009f9f";
    var i, j, r=0,k;
    var queue = []; //to store entry sequence, to decide which to eliminate
    (function theLoop (i) {
        setTimeout(function () {
            if(i!=0) //copying values except for the 1st one
            copy_initial_values(i);
       if(document.getElementById("b"+(4*i+4)).innerText=='-' && i<4) //insert directly, applicable only for 1st 4
       {    
          // alert("b"+(4*i+r)); 
          color_hits_and_misses(0,"h" + (i+1) );     
           document.getElementById("b" + (4*i+r+1)).innerText=myvar[i];
           r=r+1; 
           queue.push(myvar[i]);
           update_ratio(0);          
       }
       else if (check_for_present(queue, myvar[i])==1) //refreshing position of already-present entry
       {
           for(k=0; k<4; k++)
           {
               if(queue[k]==myvar[i])
                    queue.splice(k,1); //removing from queue
           }
           queue.push(myvar[i]); //re-inserting in queue with new priority
            color_hits_and_misses(1,"h" + (i+1));
            update_ratio(1);
       }
       else //using fifo
       {
            j=queue.shift() //popping element
            for(k=1; k<=4; k++)
            {
                if(parseInt(document.getElementById("b" + (4*(i-1)+k)).innerText) == j) 
                {
                    document.getElementById("b" + (4*i+k)).innerText = myvar[i]; //inserting the new value
                    color_hits_and_misses(0, "h"+(i+1));
                    update_ratio(0);
                    queue.push(myvar[i]); //pushing the new value in the queue
                }
            }
       }
          if (++i < myvar.length) {          // If i > 0, keep going
            theLoop(i);       // Call the loop again, and pass it the current value of i
          }
        }, 1500);
      })(0);
}

function optimal()
{
    refresh_all();
    document.getElementById("optimal").style.backgroundColor="#009f9f"; 
    var i, j, r=0,k;
    var queue = []; //to store entry sequence, to decide which to eliminate
    (function theLoop (i) {
        setTimeout(function () {
            if(i!=0) //copying values except for the 1st one
            copy_initial_values(i);
       if(document.getElementById("b"+(4*i+4)).innerText=='-' && i<4) //insert directly, applicable only for 1st 4
       {    
          // alert("b"+(4*i+r)); 
          color_hits_and_misses(0,"h" + (i+1) );     
           document.getElementById("b" + (4*i+r+1)).innerText=myvar[i];
           r=r+1; 
           update_ratio(0);          
       }
       else if (check_for_present(queue, myvar[i])==1) //gives a hit
       {
            color_hits_and_misses(1,"h" + (i+1));
            update_ratio(1);
       }
       else //using optimal
       {
           var farthest=[];
           var l, max=0, pos;
           for(l=0; l<4; l++) //for each element present, finding the next occurence
           {
               farthest.push(12); //default value - does not appear again
                for(k=i+1; k<myvar.length; k++)
                {
                    if(document.getElementById("b"+(4*(i-1)+l+1)).innerText==myvar[k])
                        farthest[l]=k;
                }
            }
            for(k=0; k<4; k++) //finding the pos of the one with the furthest occurence
            {
                if(farthest[k]>max)
                {
                    max=farthest[k];
                    pos=k;
                }
            }
            j=document.getElementById("b"+(4*(i-1)+pos+1)).innerText; //getting the element
            for(k=1; k<=4; k++) //to replace at the same block as the one getting replaced
            {
                if(parseInt(document.getElementById("b" + (4*(i-1)+k)).innerText) == j) //finding the block
                {
                    document.getElementById("b" + (4*i+k)).innerText = myvar[i]; //inserting the new value
                    color_hits_and_misses(0, "h"+(i+1));
                    update_ratio(0);
                }
            }
       }
       for(k=0; k<4; k++) //updating the current state of elements
       {
           queue[k]=document.getElementById("b"+(4*i+k+1)).innerText;
       }
          if (++i < myvar.length) {          // If i > 0, keep going
            theLoop(i);       // Call the loop again, and pass it the current value of i
          }
        }, 1500);
      })(0);
    
}
