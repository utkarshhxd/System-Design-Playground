import {
    Server, Database, Globe, Layers, HardDrive, LayoutGrid, Cloud, Shield, Box, Zap, Route,
    Smartphone, ShieldAlert, Cpu, Calculator, Clock, File, Archive, Save, List,
    Radio, Lock, Key, Router, Gauge, Book, TrendingUp, Copy, Shuffle, ToggleRight,
    FileText, BarChart, Activity, Bell, Settings, GitBranch, Container, Ship,
    Search, ListStart, PieChart, Mail, CreditCard, Link as LinkIcon,
    ChevronDown, ChevronRight, Plus, Trash2, User, Hexagon, Component, Package
} from 'lucide-react';

export const ICONS = {
    // General
    Server, Database, Globe, Layers, HardDrive, LayoutGrid, Cloud, Shield, Box, Zap, Route,
    Smartphone, ShieldAlert, Cpu, Calculator, Clock, File, Archive, Save, List,
    Radio, Lock, Key, Router, Gauge, Book, TrendingUp, Copy, Shuffle, ToggleRight,
    FileText, BarChart, Activity, Bell, Settings, GitBranch, Container, Ship,
    Search, ListStart, PieChart, Mail, CreditCard, LinkIcon,
    ChevronDown, ChevronRight, Plus, Trash2, User, Hexagon, Component, Package
};

export const ICON_NAMES = Object.keys(ICONS).sort();

export const getIcon = (name) => {
    return ICONS[name] || ICONS.Server;
};
