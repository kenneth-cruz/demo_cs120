<!DOCTYPE html>
<html>
<head>
    <title>Business Hours</title>
    <style>
        body {
            font-family: 'Times New Roman', Times, serif, sans-serif;
        }

        .hours-container {
            width: 280px;
            margin: 18px auto;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 6px;
            background-color: skyblue;
        }

        .day-hours {
            display: flex;
            justify-content: space-between;
            padding: 4px 0;
        }

        .day {
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="hours-container">
        <h3>Business Hours</h3>
        <?php
        // Associative array 
        $businessHours = [
            "Monday" => "9am - 6pm",
            "Tuesday" => "9am - 5pm",
            "Wednesday" => "9am - 5pm",
            "Thursday" => "9am - 5pm",
            "Friday" => "9am - 4pm",
            "Saturday" => "10am - 3pm",
            "Sunday" => "Closed"
        ];

        // Format the hours, display string
        function displayHours($hoursArray) {
            $output = "";
            foreach ($hoursArray as $day => $hours) {
                $output .= "<div class='day-hours'><span class='day'>$day</span><span class='hours'>$hours</span></div>";
            }
            return $output;
        }

        // displaying on the page
        echo displayHours($businessHours);
        ?>
    </div>
</body>
</html>
