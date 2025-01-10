<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->word(),
            'description' => $this->faker->sentence(),
            'price' => $this->faker->randomFloat(2, 1000, 2500),
            'stock' => $this->faker->numberBetween(0, 100),
            'sku' => $this->faker->unique()->bothify('SKU-####'),
            'image' => $this->faker->imageUrl(),
            'category' => $this->faker->randomElement(['Electronics', 'Clothing', 'Home', 'Toys']),
            'status' => $this->faker->randomElement(['available', 'unavailable']),
        ];
    }
}
