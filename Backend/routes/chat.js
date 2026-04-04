import express from "express";
import Thread from "../models/Thread.js";
import { readThreads, writeThreads } from "../utils/fileDB.js";
import getOpenAIAPIResponse from "../utils/openai.js";
import mongoose from "mongoose";
const router = express.Router();
// Helper function to check if MongoDB is connected
const isMongoConnected = () => {
    return mongoose.connection.readyState === 1;
};

//test
router.post("/test", async(req, res) => {
    try {
        if (isMongoConnected()) {
            const thread = new Thread({
                threadId: "abc",
                title: "Testing New Thread2"
            });
            const response = await thread.save();
            res.send(response);
        } else {
            const threads = readThreads();
            const newThread = {
                threadId: "abc",
                title: "Testing New Thread2",
                messages: [],
                createdAt: new Date(),
                updatedAt: new Date()
            };
            threads.push(newThread);
            writeThreads(threads);
            res.send(newThread);
        }
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to save in DB"});
    }
});

//Get all threads
router.get("/thread", async(req, res) => {
    try {
        if (isMongoConnected()) {
            const threads = await Thread.find({}).sort({updatedAt: -1});
            res.json(threads);
        } else {
            const threads = readThreads();
            const sortedThreads = threads.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            res.json(sortedThreads);
        }
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to fetch threads"});
    }
});

router.get("/thread/:threadId", async(req, res) => {
    const {threadId} = req.params;

    try {
        if (isMongoConnected()) {
            const thread = await Thread.findOne({threadId});
            if(!thread) {
                return res.status(404).json({error: "Thread not found"});
            }
            res.json(thread.messages || []);
        } else {
            const threads = readThreads();
            const thread = threads.find(t => t.threadId === threadId);
            if(!thread) {
                return res.status(404).json({error: "Thread not found"});
            }
            res.json(thread.messages || []);
        }
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to fetch chat"});
    }
});

router.delete("/thread/:threadId", async (req, res) => {
    const {threadId} = req.params;

    try {
        if (isMongoConnected()) {
            const deletedThread = await Thread.findOneAndDelete({threadId});
            if(!deletedThread) {
                return res.status(404).json({error: "Thread not found"});
            }
            res.status(200).json({success : "Thread deleted successfully"});
        } else {
            const threads = readThreads();
            const filteredThreads = threads.filter(t => t.threadId !== threadId);
            if (threads.length === filteredThreads.length) {
                return res.status(404).json({error: "Thread not found"});
            }
            writeThreads(filteredThreads);
            res.status(200).json({success : "Thread deleted successfully"});
        }
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to delete thread"});
    }
});

router.post("/chat", async(req, res) => {
    const {threadId, message} = req.body;

    if(!threadId || !message) {
        return res.status(400).json({error: "missing required fields"});
    }

    try {
        // Get existing conversation history for context
        let conversationHistory = [];
        
        if (isMongoConnected()) {
            const thread = await Thread.findOne({threadId});
            if (thread && thread.messages) {
                conversationHistory = thread.messages.map(m => ({
                    role: m.role,
                    content: m.content
                }));
            }
        } else {
            const threads = readThreads();
            const thread = threads.find(t => t.threadId === threadId);
            if (thread && thread.messages) {
                conversationHistory = thread.messages.map(m => ({
                    role: m.role,
                    content: m.content
                }));
            }
        }
        
        // Add the new user message to history
        conversationHistory.push({role: "user", content: message});
        
        // Get AI response with full conversation context
        const assistantReply = await getOpenAIAPIResponse(conversationHistory);
        
        if (isMongoConnected()) {
            let thread = await Thread.findOne({threadId});
            
            if(!thread) {
                thread = new Thread({
                    threadId,
                    title: message.length > 50 ? message.substring(0, 50) + "..." : message,
                    messages: [{role: "user", content: message, timestamp: new Date()}]
                });
            } else {
                thread.messages.push({role: "user", content: message, timestamp: new Date()});
            }
            
            thread.messages.push({role: "assistant", content: assistantReply, timestamp: new Date()});
            thread.updatedAt = new Date();
            await thread.save();
        } else {
            const threads = readThreads();
            let thread = threads.find(t => t.threadId === threadId);
            
            if(!thread) {
                thread = {
                    threadId,
                    title: message.length > 50 ? message.substring(0, 50) + "..." : message,
                    messages: [{role: "user", content: message, timestamp: new Date()}],
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
                threads.push(thread);
            } else {
                if (!thread.messages) thread.messages = [];
                thread.messages.push({role: "user", content: message, timestamp: new Date()});
                thread.updatedAt = new Date();
            }
            
            thread.messages.push({role: "assistant", content: assistantReply, timestamp: new Date()});
            thread.updatedAt = new Date();
            writeThreads(threads);
        }
        
        res.json({reply: assistantReply});
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "something went wrong"});
    }
});




export default router;
