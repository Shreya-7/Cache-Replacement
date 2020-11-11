
document.addEventListener('DOMContentLoaded', function() {

    document.querySelector('#submit').addEventListener('click', display_values);

    document.querySelector('#fifo').addEventListener('click', function() {
        refresh_all(); 
        this.style.backgroundColor = "#009f9f";
        cache(true, false, false);
    });
    document.querySelector('#lru').addEventListener('click', function() {
        refresh_all(); 
        this.style.backgroundColor = "#009f9f";
        cache(false, true, false);
    });
    document.querySelector('#optimal').addEventListener('click', function() {
        refresh_all(); 
        this.style.backgroundColor = "#009f9f";
        cache(false, false, true);
    });
});


function makeDivs(blocks, numbers)
{
    for(let i=0; i<=blocks; i++)
    {
        //creating blocks having block number
        let p = document.createElement("p");
        p.classList.add("blocks", "block-number");
        p.innerText = "Block " + (i+1);

        //hit/miss placeholder block
        if(i==blocks)
        {
            p.innerText = "Hit/Miss";
            p.style.backgroundColor = "teal";
        }

        document.getElementById("block_area").appendChild(p);
    }

    //creating actual blocks containing values
    for(let i=0; i<numbers.length; i++)
    {
        let div = document.createElement("div");
        div.classList.add("phase"+i);

        //for every column
        for(let j=1; j<=blocks+1; j++)
        {
            let mini = document.createElement("div");
            mini.classList.add("blocks");

            //value blocks
            if(j<=blocks)
                mini.setAttribute('id', "b"+(i*blocks+j));

            //hit and miss block
            else
            {
                mini.classList.add('status-block')
                mini.setAttribute('id', "h"+(i+1));
                mini.style.backgroundColor="gray";
            }
            div.appendChild(mini);
        }

        document.getElementById("value_blocks").appendChild(div);
    }
}

//for every fresh input (not for changing policy for the same input)
function display_values()
{
    refresh_all();

    //remove all blocks created for a fresh layout based on input
    let blocks = Array.from(document.querySelectorAll(".blocks"));
    blocks.forEach(element => element.remove());

    window.myarray;
    window.block;

    //no of blocks
    block = document.getElementById("block_input").value;
    //actual inpu values
    myarray = document.getElementById("value_input").value;

    //inputID needed only to know which field to clear
    function validateForInt(number, inputID)
    {
        number.trim();
        let temp = parseInt(number);
        if(isNaN(temp)==false)
        {
            return true;
        }
        else
        {
            alert("Please enter only numeric values!");
            document.getElementById(inputID).value="";
            return false;
        }
    }

    //validate number of blocks
    let temp = validateForInt(block, "block_input");
    if(temp==true)
        block = parseInt(block);

    //validating value input
    myarray = myarray.trim().split(" ");
    for(let i=0; i<myarray.length; i++)
    {
        let temp = validateForInt(myarray[i], "value_input");
        if(temp==true)
            myarray[i] = parseInt(myarray[i]);
    }

    //setting denominator for the status
    let status = Array.from(document.querySelectorAll(".deno"));
    status.forEach(element => element.innerText="/"+myarray.length);

    makeDivs(block, myarray);
}

//function to reset block content and hit&miss ratio
function refresh_all()
{
    //set initial value for status
    document.getElementById("hits").innerText='0';
    document.getElementById("miss").innerText='0';
    
    let blocks = Array.from(document.querySelectorAll(".blocks"));
    blocks.forEach(element => {

        //if value block, not block containing block number
        if(!'block-number' in element.classList)
            element.innerHTML='';

        //if hit&miss status block
        if('status-block' in element.classList)
            element.style.backgroundColor = 'gray';
    });

    //reset button colors
    document.getElementById("lru").style.backgroundColor="white";
    document.getElementById("fifo").style.backgroundColor="white";
    document.getElementById("optimal").style.backgroundColor="white";
}

function copy_initial_values(k)
{
    var i, x;
    for(i=1; i<=block; i++)
    {
        x=document.getElementById("b" + (block*(k-1)+i)).innerText;
        //if number is present
        if(x!="")
            document.getElementById("b" + (block*k +i)).innerText= parseInt(x);
        //number not assigned yet
        else
            break;
    }
}

function update_ratio(k)
{
    var s, r, status_id;

    //determine whether hit or miss
    if(k==1)
        status_id = "hits"
    else
        status_id="miss"

    //update ratio value
    r = parseInt(document.getElementById(status_id).innerText) + 1;

    //set ratio value
    document.getElementById(status_id).innerText=r;
}

function color_hits_and_misses(a, given)
{
    const colors = ['red', 'green'];
    document.getElementById(given).style.backgroundColor=colors[a];
}

function check_for_present(queue, ele)
{
    var i;
    for(i=0; i<block; i++)
    {
        if(queue[i]==ele)
            return true;
    }
    return false;
}


function cache(fifo, lru, optimal)
{
    // i - loop counter, r - phase counter
    var i=0, j, r=0, k;
    var queue = []; //to store entry sequence, to decide which to eliminate
    (function theLoop (i) {
        setTimeout(function () {

            //copying previous values
            if(i!=0)
                copy_initial_values(i);

            //insert directly, applicable only for 1st 4
            if(document.getElementById("b"+(block*i+block)).innerText=='' && i<block)
            {    
                color_hits_and_misses(0,"h" + (i+1) );     
                document.getElementById("b" + (block*i+r+1)).innerText=myarray[i];
                r=r+1; 
                queue.push(myarray[i]);
                update_ratio(0);          
            }

            // hit found
            else if (check_for_present(queue, myarray[i]))
            {
                // refresh entry position for LRU
                if (lru)
                {
                    for(k=0; k<block; k++)
                    {
                        if(queue[k]==myarray[i])
                                queue.splice(k,1); //removing from queue
                    }

                    // adding at the back, thus "renewed"
                    queue.push(myarray[i]);
                }
                color_hits_and_misses(1,"h" + (i+1));
                update_ratio(1);
                    
            }
            
            // replacement logic
            else
            {
                // find a replacement using FIFO
                if(fifo || lru)
                {
                    j=queue.shift() //popping the element

                    // find which block has the element to be replaced
                    for(k=1; k<=block; k++)
                    {
                        if(parseInt(document.getElementById("b" + (block*(i-1)+k)).innerText) == j)
                        {
                            // updating the value
                            document.getElementById("b" + (block*i+k)).innerText = myarray[i];

                            // push new value in the queue
                            queue.push(myarray[i]);
                        }
                    }
                }

                // use OPTIMAL logic
                else
                {
                    var l, pos;
                    var distance, max_distance=0;

                    // find element which is farthest in the input from the current point
                    for(l=0; l<block; l++)
                    {
                        // set default; to find if no element is being repeated
                        distance = myarray.length+1;

                        for(k=i+1; k<myarray.length; k++)
                        {
                            if(document.getElementById("b"+(block*(i-1)+l+1)).innerText==myarray[k])
                            {
                                distance = k;
                                break;
                            }
                        }

                        // if the current element is farthest, store it's block number in pos
                        if(distance>max_distance)
                        {
                            max_distance = distance;
                            pos = l;
                        }
                    }

                    // getting the element to be replaced
                    j=document.getElementById("b"+(block*(i-1)+pos+1)).innerText;

                    // insert the new value
                    document.getElementById("b" + (block*i+pos+1)).innerText = myarray[i];
                }

                color_hits_and_misses(0, "h"+(i+1));
                update_ratio(0);                    
            }

            if(optimal)
            {
                for(k=0; k<block; k++) //updating the current state of elements
                {
                    queue[k]=document.getElementById("b"+(block*i+k+1)).innerText;
                }
            }

            // loop condition
            if (++i < myarray.length) 
            { 
                theLoop(i); // Call the loop again, and pass it the increased value of i
            }
        }, 1500);
    })(0); // i = 0 initially
}




