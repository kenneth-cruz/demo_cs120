<!DOCTYPE html>
<html>
<head>
    <title>Business Hours</title>
    <style>
        body {
            font-family: Arial, sans-serif;
        }

        .hours-container {
            width: 300px;
            margin: 20px auto;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 6px;
            background-color: #f9f9f9;
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
        <h2>Business Hours</h2>
        <?php
        // Step 2: Create associative array of business hours
        $businessHours = [
            "Monday" => "9am - 4pm",
            "Tuesday" => "9am - 4pm",
            "Wednesday" => "9am - 4pm",
            "Thursday" => "9am - 4pm",
            "Friday" => "9am - 4pm",
            "Saturday" => "10am - 2pm",
            "Sunday" => "Closed"
        ];

        // Step 3: Function to format hours
        function displayHours($hoursArray) {
            $output = "";
            foreach ($hoursArray as $day => $hours) {
                $output .= "<div class='day-hours'><span class='day'>$day</span><span class='hours'>$hours</span></div>";
            }
            return $output;
        }

        // Step 4: Output business hours
        echo displayHours($businessHours);
        ?>
    </div>
</body>
</html>
