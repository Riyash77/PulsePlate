cmake_minimum_required(VERSION 3.20)
project(SBAMS)
set(CMAKE_CXX_STANDARD 17)
include_directories(include)
add_executable(
    SBAMS
    src/main.cpp
)