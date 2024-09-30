<?php 
	
if ($_SERVER['REQUEST_METHOD'] == 'POST') { 
				
	function get_data() { 
		$file_name='formData'. '.json'; //name of the json file

		if(file_exists("$file_name")) { 
			$current_data=file_get_contents("$file_name"); //pick data from json
			$array_data=json_decode($current_data, true); //decode the data
				
			//array field for the data came from html page
			$extra=array( 
				'Name' => $_POST['p_name'],
				'Email' => $_POST['p_email'], 
				'Message' => $_POST['comment'], 
			); 
			$array_data[]=$extra; //store array
			echo "file exist<br/>"; 
			return json_encode($array_data); //return json data
		} 
		else { 
			$datae=array(); 
			$datae[]=array( 
				'Name' => $_POST['p_name'], 
				'Email' => $_POST['p_email'], 
				'Message' => $_POST['comment'], 
			); 
			echo "file not exist<br/>"; 
			return json_encode($datae); 
		} 
	} 

	$file_name='formData'. '.json'; //json file name
	
	if(file_put_contents("$file_name", get_data())) { 
		header("Location: index.html");//html page name
        exit;
 
	}				 
	else { 
		echo 'There is some error';				 
	} 
} 
	
?> 
